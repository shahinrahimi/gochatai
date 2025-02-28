package main

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/jackc/pgx/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func connectToDB(dbURL string) *sql.DB {
	var count = 0
	for {
		conn, err := openDB(dbURL)
		if err != nil {
			log.Printf("Postgres DB not ready yet... %v", err)
			count++
		} else {
			log.Println("Connected to Postgres DB!")
			return conn
		}

		if count > 10 {
			log.Println("Failed to connect to DB after maximum tries...")
			return nil
		}
		sleepTime := time.Second * time.Duration(count)
		log.Printf("Backing off for %v seconds.", sleepTime)
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
