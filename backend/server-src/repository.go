package main

import (
	"encoding/json"
	"errors"

	pb "github.com/hashimiya/siiid-gke/backend/proto"
	"github.com/xyproto/simpleredis"
)

const (
	initialID     = 1
	redisListName = "points"
)

// ID .
type ID int

// Repository interface
type Repository interface {
	Find(ID) (*pb.PointSummary, error)
	FindList() ([]*pb.PointSummary, error)
	Create(*pb.PointSummary) (*pb.PointSummary, error)
}

// VarRepository ,
type VarRepository struct {
	currentID int
	points    map[ID]*pb.PointSummary
}

// RedisRepository Redis
type RedisRepository struct {
	masterPool *simpleredis.ConnectionPool
	slavePool  *simpleredis.ConnectionPool
}

/** --- VarRepository functions. --- **/

// NewVarRepository 初期化
func NewVarRepository() *VarRepository {
	return &VarRepository{
		currentID: initialID,
		points:    make(map[ID]*pb.PointSummary),
	}
}

// Find ,
func (v VarRepository) Find(id ID) (*pb.PointSummary, error) {
	if point, ok := v.points[id]; ok {
		return point, nil
	}
	return &pb.PointSummary{}, errors.New("not found")
}

// FindList ,
func (v VarRepository) FindList() ([]*pb.PointSummary, error) {
	result := []*pb.PointSummary{}
	for _, point := range v.points {
		result = append(result, point)
	}
	return result, nil
}

// Create ,
func (v *VarRepository) Create(point *pb.PointSummary) (*pb.PointSummary, error) {
	point.Id = int32(v.currentID)
	v.points[ID(point.Id)] = point
	v.currentID++
	return point, nil
}

/** --- RedisRepository functions. --- **/

// NewRedisRepository .
func NewRedisRepository() *RedisRepository {
	return &RedisRepository{
		masterPool: simpleredis.NewConnectionPoolHost("redis-master:6379"),
		slavePool:  simpleredis.NewConnectionPoolHost("redis-slave:6379"),
	}
}

// Find from redis
func (r *RedisRepository) Find(id ID) (*pb.PointSummary, error) {
	list := simpleredis.NewList(r.slavePool, redisListName)
	all, err := list.GetAll()
	if err != nil {
		return &pb.PointSummary{}, err
	}
	for _, v := range all {
		point := &pb.PointSummary{}
		err := json.Unmarshal([]byte(v), point)
		if err != nil {
			return &pb.PointSummary{}, err
		}
		if int(id) == int(point.GetId()) {
			return point, nil
		}
	}
	return &pb.PointSummary{}, errors.New("not found")
}

// FindList from redis
func (r *RedisRepository) FindList() ([]*pb.PointSummary, error) {
	list := simpleredis.NewList(r.slavePool, redisListName)
	all, err := list.GetAll()
	if err != nil {
		return []*pb.PointSummary{}, err
	}
	result := []*pb.PointSummary{}
	for _, v := range all {
		point := &pb.PointSummary{}
		err := json.Unmarshal([]byte(v), point)
		if err != nil {
			return []*pb.PointSummary{}, err
		}
		result = append(result, point)
	}
	return result, nil
}

// Create from redis
func (r *RedisRepository) Create(point *pb.PointSummary) (*pb.PointSummary, error) {
	list := simpleredis.NewList(r.masterPool, redisListName)
	last, err := list.Last()
	if err != nil {
		return &pb.PointSummary{}, err
	}
	id := initialID
	if "" != last {
		lastPoint := &pb.PointSummary{}
		err := json.Unmarshal([]byte(last), lastPoint)
		if err != nil {
			return &pb.PointSummary{}, err
		}
		id = int(lastPoint.GetId()) + 1
	}
	point.Id = int32(id)
	json, err := json.Marshal(point)
	if err != nil {
		return &pb.PointSummary{}, err
	}
	list.Add(string(json))
	return point, nil
}

// Close from redis
func (r *RedisRepository) Close() {
	r.masterPool.Close()
	r.slavePool.Close()
}
