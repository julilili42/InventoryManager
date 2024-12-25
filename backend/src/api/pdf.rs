use axum::{
    extract::Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use printpdf::*;
use std::io::{BufWriter, Cursor};

use crate::core::types::Article;

pub async fn generate_pdf(Json(data): Json<Article>) -> Response {
    let (doc, page1, layer1) = PdfDocument::new("PDF Template", Mm(210.0), Mm(297.0), "Layer 1");
    let current_layer = doc.get_page(page1).get_layer(layer1);

    let font = doc.add_builtin_font(BuiltinFont::Helvetica).unwrap();
    current_layer.use_text(
        data.article_id.to_string(),
        48.0,
        Mm(10.0),
        Mm(250.0),
        &font,
    );
    current_layer.use_text(data.price.to_string(), 24.0, Mm(10.0), Mm(230.0), &font);
    current_layer.use_text(&data.manufacturer, 24.0, Mm(10.0), Mm(210.0), &font);
    current_layer.use_text(data.stock.to_string(), 24.0, Mm(10.0), Mm(190.0), &font);

    let mut buffer = Cursor::new(Vec::new());
    {
        let mut writer = BufWriter::new(&mut buffer);
        doc.save(&mut writer).unwrap();
    }

    (
        StatusCode::OK,
        [("Content-Type", "application/pdf")],
        buffer.into_inner(),
    )
        .into_response()
}
