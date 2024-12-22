//server.rs
use crate::api::routes;
use crate::core::operations::create_table;
use axum::{Extension, Router};
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

pub async fn start_api_server() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // SQLite Verbindungspool erstellen
    let manager = SqliteConnectionManager::file("database.db");
    let pool = Arc::new(Pool::builder().max_size(5).build(manager).unwrap());

    let conn = pool.get().expect("Failed to get connection from pool");

    if let Err(e) = create_table(&conn) {
        eprintln!("Failed to create table: {}", e);
    }

    // Router konfigurieren und Pool als Extension weitergeben
    let app = Router::new()
        .merge(routes::get_routes())
        .layer(Extension(pool)) // Verbindungspool weitergeben
        .layer(cors); // CORS Layer hinzufügen

    // Server Adresse konfigurieren
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Server läuft auf {}", addr);

    // Server starten
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
