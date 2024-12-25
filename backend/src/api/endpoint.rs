// endpoint.rs
use axum::{
    extract::{Extension, Json, Multipart, Path},
    http::StatusCode,
    response::{Json as AxumJson, Response},
};

use csv::ReaderBuilder;
use std::{fmt::Debug, io::Cursor};

use crate::core::types::{Article, DbPool};
use crate::core::{
    operations::{
        delete_record_by_id, establish_connection, fetch_all_records, insert_record, update_record,
    },
    traits::{Mappable, Insertable},
};
use serde_json::json;

use crate::api::pdf::generate_pdf;

// POST /pdf_gen
pub async fn handle_generate_pdf(
    Json(article): Json<Article>,
) -> Result<Response, (StatusCode, AxumJson<serde_json::Value>)> {
    let pdf_response = generate_pdf(Json(article)).await;
    Ok(pdf_response)
}

// GET /data
pub async fn handle_fetch_records<T: Mappable + Insertable + Debug>(
    Extension(pool): Extension<DbPool>,
) -> Result<AxumJson<Vec<T>>, (StatusCode, AxumJson<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;

    match fetch_all_records::<T>(&conn) {
        Ok(item_list) => Ok(AxumJson(item_list)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            AxumJson(json!({ "error": format!("Failed to get connection: {}", e) })),
        )),
    }
}

// POST /add_entry
pub async fn handle_create_record<T: Mappable + Insertable + Debug>(
    Extension(pool): Extension<DbPool>,
    Json(item): Json<T>,
) -> Result<(StatusCode, AxumJson<serde_json::Value>), (StatusCode, AxumJson<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;

    match insert_record::<T>(&conn, &item) {
        Ok(_) => Ok((
            StatusCode::OK,
            AxumJson(json!({ "message": format!("Item added successfully: {}", item.id_value()) })),
        )),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            AxumJson(json!({"error": format!("Failed to add item: {}", e)})),
        )),
    }
}

// DELETE /delete_entry/:id
pub async fn handle_delete_record<T: Mappable + Insertable + Debug>(
    Extension(pool): Extension<DbPool>,
    id: Option<Path<i32>>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;
    let deletion_id = id.map(|id| id.0);

    match delete_record_by_id::<T>(&conn, &deletion_id) {
        Ok(_) => Ok((
            StatusCode::OK,
            Json(
                json!({ "message": format!("Item {} deleted successfully", deletion_id.unwrap_or(-1)) }),
            ),
        )),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            Json(json!({ "error": format!("Failed to delete article: {}", e) })),
        )),
    }
}

// PUT /update_entry
pub async fn handle_update_record<T: Mappable + Insertable + Debug>(
    Extension(pool): Extension<DbPool>,
    Json(updated_item): Json<T>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;

    match update_record(&conn, &updated_item) {
        Ok(_) => Ok((
            StatusCode::OK,
            AxumJson(
                json!({ "message": format!("Record {} updated successfully", updated_item.id_value()) }),
            ),
        )),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            AxumJson(
                json!({ "error": format!("Failed to update record {}: {}", updated_item.id_value(), e) }),
            ),
        )),
    }
}

pub async fn handle_import_csv(
    Extension(pool): Extension<DbPool>,
    mut multipart: Multipart,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;

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

        insert_record(&conn, &record).map_err(|e| {
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
