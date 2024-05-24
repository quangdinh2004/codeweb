<?php
require_once '../../config/database.php';
spl_autoload_register(function ($className)
{
   require_once "../models/$className.php";
});

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['categoriesId'];
$page = $input['page'];
$perPage = $input['perPage'];

$productModel = new ProductModel();
if(empty($id)) {
   $product = $productModel->getAllProducts();
}
else {
   $product = $productModel->getProductByCategories($id, $page, $perPage);
}
echo json_encode($product);