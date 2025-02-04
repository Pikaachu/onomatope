<?php
require 'db_connect.php';

header('Content-Type: application/json');

$categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

try {
    $query = "
        SELECT 
            o.id, 
            o.name, 
            o.name_romaji, 
            o.explanation_ja, 
            o.explanation_en, 
            o.example_ja, 
            o.example_en, 
            o.image_path, 
            o.effect_path, 
            c.name AS category_name 
        FROM 
            onomatope_table o
        JOIN 
            category_table c 
        ON 
            o.category_id = c.id
    ";

    if ($categoryId > 0) {
        $query .= " WHERE o.category_id = :category_id";
    }

    $stmt = $conn->prepare($query);

    if ($categoryId > 0) {
        $stmt->bindParam(':category_id', $categoryId, PDO::PARAM_INT);
    }

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}