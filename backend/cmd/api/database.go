package main

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/jackc/pgx/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type Config struct {
  dbURL string
  l *log.Logger
}
  
func NewConfig(dbURL string, l *log.Logger) *Config {
  return &Config{
    dbURL: dbURL,
    l: l,
  }
}

func (c *Config) connectToDB() *sql.DB {
	var count = 0
	for {
		conn, err := openDB(c.dbURL)
		if err != nil {
			c.l.Printf("Postgres DB not ready yet... %v", err)
			count++
		} else {
			c.l.Println("Connected to Postgres DB!")
			return conn
		}

		if count > 10 {
			c.l.Println("Failed to connect to DB after maximum tries...")
			return nil
		}
		sleepTime := time.Second * time.Duration(count)
		c.l.Printf("Backing off for %v seconds.", sleepTime)
		time.Sleep(sleepTime)
		continue
	}
}

func openDB(dbURL string) (*sql.DB, error) {
	conn, err := sql.Open("pgx", dbURL)
	if err != nil {
		return nil, err
	}
	if err := conn.Ping(); err != nil {
		return nil, err
	}

	return conn, nil
}
