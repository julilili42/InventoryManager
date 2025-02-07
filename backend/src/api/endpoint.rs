// endpoint.rs
use axum::{
    extract::{Extension, Json, Multipart, Path},
    http::StatusCode,
    response::{Json as AxumJson, Response},
};

use csv::ReaderBuilder;
use std::{fmt::Debug, io::Cursor};

use crate::core::{
    statistics::stats::get_statistics,
    operations::find_record_by_id,
    types::{Article, DbPool, Order, Statistics},
};

use crate::core::{
    operations::{
        delete_record_by_id, establish_connection, fetch_all_records, insert_record, update_record,
    },
    traits::{Insertable, Mappable},
};
use serde_json::json;

use crate::api::pdf_gen::pdf::fetch_pdf;

// GET <T>/search/:id
pub async fn handle_search<T: Mappable + Insertable>(
    Extension(pool): Extension<DbPool>,
    id: Path<i32>,
) -> Result<AxumJson<T>, (StatusCode, AxumJson<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;
    let search_id = id.0;

    match find_record_by_id::<T>(&conn, search_id) {
        Ok(item) => Ok(AxumJson(item)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            AxumJson(json!({"error": format!("Failed to search id {}: {}", search_id, e)})),
        )),
    }
}

// GET /<T>
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

// POST /<T>/add
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

// DELETE /<T>/delete (optional /:id)
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

// PUT /<T>/update
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

// GET /operations/statistics
pub async fn handle_statistics(
    Extension(pool): Extension<DbPool>,
) -> Result<AxumJson<Statistics>, (StatusCode, AxumJson<serde_json::Value>)> {
    let conn = establish_connection(&pool)?;

    match get_statistics(&conn) {
        Ok(statistics) => Ok(AxumJson(statistics)),
        Err(e) => Err((
            StatusCode::BAD_REQUEST,
            AxumJson(json!({ "error": format!("Failed to retrieve statistics: {}", e) })),
        )),
    }
}


// POST /pdf_gen
pub async fn handle_generate_pdf(
    Json(order): Json<Order>,
) -> Result<Response, (StatusCode, AxumJson<serde_json::Value>)> {
    let pdf_response = fetch_pdf(Json(order)).await;
    Ok(pdf_response)
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
