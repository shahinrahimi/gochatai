package main

type Message struct {
  From string `json:"from"`
  Content string `json:"content"`
}

type Chat struct {
  ID string `json:"id"`
  Title string `json:"title"`
  Messages []Message `json:"messages"`
}

type Storage interface {
  GetChatByID(ID string) (*Chat, error)
  CreateChat() (string, error)
  GetChats() ([]*Chat, error)
  UpdateChat(c *Chat) error
  DeleteChat(ID string) error
}

const (
  CREATE_TABLE_CHATS = `
    CREATE TABLE IF NOT EXIXST chats (
      id TEXT PRIMARY UNIQUE,
      title TEXT,
      Messages
    )

  `
)
