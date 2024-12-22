// endpoint.rs
use axum::{
    extract::{Extension, Json, Multipart, Path},
    http::StatusCode,
    response::Json as AxumJson,
};

use csv::ReaderBuilder;
use std::io::Cursor;

use crate::core::operations::{
    delete_article, get_all_article, get_connection, insert_article,
    update_article,
};
use crate::core::types::{Article, DbPool};
use serde_json::json;

// IDEE
// import_csv Funktion parse_csv extrahieren und in operations.rs verschieben
// import csv Feld namen anpassen auf deutsch (Artikelnummer, Preis, Hersteller, Bestand)

// GET /data
pub async fn get_data(
    Extension(pool): Extension<DbPool>,
) -> Result<AxumJson<Vec<Article>>, String> {
    let conn = pool.get().map_err(|_| "Failed to get connection")?;

    match get_all_article(&conn) {
        Ok(artikel_liste) => Ok(AxumJson(artikel_liste)),
        Err(e) => Err(format!("Failed to fetch data: {}", e)),
    }
}

// POST /add_entry
pub async fn add_entry(
    Extension(pool): Extension<DbPool>,
    Json(article): Json<Article>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = get_connection(&pool)?;

    match insert_article(&conn, article) {
        Ok(_) => Ok((
            StatusCode::OK,
            Json(json!({ "message": "Article added successfully" })),
        )),
        Err(e) => Ok((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": e.to_string() })),
        )),
    }
}

// DELETE /delete_entry/:article_id
pub async fn delete_entry(
    Extension(pool): Extension<DbPool>,
    article_id: Option<Path<i32>>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = get_connection(&pool)?;

    match delete_article(&conn, article_id.map(|id| id.0)) {
        Ok(_) => Ok((
            StatusCode::OK,
            Json(json!({ "message": "Article deleted successfully" })),
        )),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": format!("Failed to delete article: {}", e) })),
        )),
    }
}

// PUT /update_entry
pub async fn update_entry(
    Extension(pool): Extension<DbPool>,
    Json(payload): Json<Article>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = get_connection(&pool)?;

    match update_article(&conn, payload) {
        Ok(_) => Ok((
            StatusCode::OK,
            AxumJson(json!({ "message": "Article updated successfully" })),
        )),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            AxumJson(json!({ "error": e.to_string() })),
        )),
    }
}

pub async fn import_csv(
    Extension(pool): Extension<DbPool>,
    mut multipart: Multipart,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = get_connection(&pool)?;

    let mut file_data = None;
    while let Some(field) = multipart.next_field().await.unwrap_or(None) {
        if field.name() == Some("file") {
            file_data = Some(field.bytes().await.unwrap());
            break;
        }
    }

    let data = match file_data {
        Some(data) => data,
        None => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "Keine Datei hochgeladen" })),
            ))
        }
    };

    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(Cursor::new(data));

    for result in rdr.deserialize() {
        let record: Article = result.map_err(|e| {
            (
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": format!("CSV-Parsing-Fehler: {}", e) })),
            )
        })?;

        insert_article(&conn, record).map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": format!("Fehler beim Einfügen: {}", e) })),
            )
        })?;
    }

    Ok((
        StatusCode::OK,
        Json(json!({ "message": "CSV erfolgreich importiert" })),
    ))
}

