<?php
include 'db_connect.php';

$stmt = $conn->prepare('SELECT * FROM  category_table');
$stmt->execute();
$categoryList = $stmt->fetchAll(PDO::FETCH_ASSOC);