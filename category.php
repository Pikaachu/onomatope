<?php

include('db_connect.php');

$stmt = $conn->prepare('SELECT * FROM  category_table');
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

var_dump($rows);
?>