use axum::{
    extract::Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use printpdf::*;
use std::io::{BufWriter, Cursor};

use crate::core::types::PdfRequest;

pub async fn generate_pdf(Json(data): Json<PdfRequest>) -> Response {
    let (doc, page1, layer1) = PdfDocument::new("PDF Template", Mm(210.0), Mm(297.0), "Layer 1");
    let current_layer = doc.get_page(page1).get_layer(layer1);

    let font = doc.add_builtin_font(BuiltinFont::Helvetica).unwrap();

    // Adress header
    current_layer.use_text(
        format!("{} {}", data.customer.first_name, data.customer.last_name),
        12.0,
        Mm(20.0),
        Mm(280.0),
        &font,
    );
    current_layer.use_text(
        format!("{}", data.customer.street),
        12.0,
        Mm(20.0),
        Mm(275.0),
        &font,
    );
    current_layer.use_text(
        format!("{} {}", data.customer.zip_code, data.customer.location),
        12.0,
        Mm(20.0),
        Mm(270.0),
        &font,
    );

    /* current_layer.use_text(data.articles.stock.to_string(), 24.0, Mm(10.0), Mm(190.0), &font);
    current_layer.use_text(data.articles.manufacturer, 24.0, Mm(10.0), Mm(210.0), &font);
    current_layer.use_text(data.articles.price.to_string(), 24.0, Mm(10.0), Mm(230.0), &font);
    current_layer.use_text(
        data.articles.article_id.to_string(),
        24.0,
        Mm(10.0),
        Mm(250.0),
        &font,
    ); */

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
