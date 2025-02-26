//server.rs
use crate::api::routes;
use crate::core::operations::initialize_tables;
use axum::{Extension, Router};
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use std::sync::Arc;
use std::env;
use std::fs;
use std::path::PathBuf;
use tower_http::cors::{Any, CorsLayer};

fn get_project_root() -> PathBuf {
    let current_dir = env::current_dir().expect("Failed to get current directory");
    current_dir.parent().unwrap().to_path_buf() 
}



pub async fn start_api_server() {
    // DB Path
    let project_root = get_project_root();
    let db_path = project_root.join("data/database.db");
    let db_dir = db_path.parent().unwrap(); 

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).expect("Failed to create data directory");
    }


    
    // SQLite Connection Pool
    let manager = SqliteConnectionManager::file(db_path);
    let pool = Arc::new(Pool::builder().max_size(5).build(manager).unwrap());

    let conn = pool.get().expect("Failed to get connection from pool");

    if let Err(e) = initialize_tables(&conn) {
        eprintln!("Failed to create table: {}", e);
    }


    let cors = CorsLayer::new()
    .allow_origin(Any)  
    .allow_methods(Any)  
    .allow_headers(Any); 

    
    let app = Router::new()
        .merge(routes::get_routes())
        .layer(cors.clone())
        .layer(Extension(pool));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await.unwrap_or_else(|_| panic!("Unable to listen on 127.0.0.1:8080"));

    axum::serve(listener, app).await.unwrap();
    
}
