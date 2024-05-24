<?php
require_once './config/database.php';
spl_autoload_register(function ($className) {
    require_once "./app/models/$className.php";
});


$productModel = new ProductModel();

$productList = $productModel->getAllProducts();
$categoryModel = new CategoryModel();
$categoryList = $categoryModel->getAllCategories();

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="http://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
    <style>
        .highlight {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body class="bg-light">
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <?php
                    foreach ($categoryList as $item) {
                    ?>
                        <li class="nav-item">
                            <a class="nav-link" href="category.php?id=<?php echo $item['id']; ?>"><?php echo $item['name']; ?></a>
                        </li>
                    <?php
                    }
                    ?>
                </ul>
                <form class="d-flex position-relative" role="search" action="search.php" method="get">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" name="q">
                    <button class="btn btn-outline-success" type="submit">Search</button>

                    <ul class="list-group position-absolute product-list" style="inset: 0; top: 100%; z-index: 1">
                    </ul>
                </form>
            </div>
        </div>
    </nav>
    <div class="container mt-5">
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <?php
            foreach ($categoryList as $item) :
            ?>

            <input type="checkbox" class="btn-check btn-category" id="cb-<?php echo $item['id']; ?>" autocomplete="off" value="<?php echo $item['id']; ?>">
            <label class="btn btn-outline-primary" for="cb-<?php echo $item['id']; ?>"><?php echo $item['name']; ?></label>

            <?php
            endforeach
            ?>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row product-container">
                    <?php
                    foreach ($productList as $item) {
                    ?>
                        <div class="col-md-3">
                            <img src="./public/images/<?php echo $item['image']; ?>" alt="" class="img-fluid product-photo" data-product-id="<?php echo $item['id']; ?>" data-bs-toggle="modal" data-bs-target="#productModal">
                            <a href="product.php?id=<?php echo $item['id']; ?>">
                                <h6><?php echo $item['name']; ?></h6>
                            </a>

                            <span class="badge text-bg-warning" id="view-<?php echo $item['id']; ?>"><i class="bi bi-eye-fill"></i> <?php echo $item['views']; ?></span>

                            <button class="btn badge text-bg-danger btn-like" value="<?php echo $item['id']; ?>"><i class="bi bi-heart-fill"></i> <?php echo $item['likes']; ?></button>

                            <?php echo $item['price']; ?>

                        </div>
                    <?php
                    }
                    ?>
                </div>
                <button class="btn btn-primary btn-loadmore" style="display: none;">Load more</button>
            </div>
        </div>

    </div>

    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="productModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"></script>
    <script src="public/js/app.js"></script>
</body>

</html>