<?php

$dns = 'mysql:host=localhost; dbname=onomatope_db;';
$user = 'nomun';
$password = 'password';
$conn = null;

try {
    $conn = new PDO($dns, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
