function sayHello() {
  var name = document.getElementById("name").value;
  var message = "<h2>Hello" + " " + name + "!</h2>"


  document
    .getElementById("Hello")
    .innerHTML = message;
}




document.addEventListener("DOMContentLoaded",
  function () {
    const menuToggle = document.getElementById('navbar-collapsion');
    const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

    document.querySelector(".navbar-toggler")
      .addEventListener("blur",
        function (event) {
          let screenWidth = window.innerWidth;
          if (screenWidth < 768) {
            bsCollapse.toggle();
          }
        });
  });






(function (global) {

  var ns = {};
  var allCategoriesUrl = "data/categories.json";
  var categoriesTitleHtml = "fragments/categories_title_fragment.html";
  var categoryHtml = "fragments/category-fragment.html";

  var catalogItemsUrl = "data/catalog/";
  var catalogItemsTitleHtml = "fragments/catalog-item-title.html";
  var catalogItemHtml = "fragments/catalog-item.html";
  var topItemsHtml = "fragments/top-catalog-fragments.html";
  var topItemsUrl = "data/catalog"

  var homeHtml = "fragments/home-fragment.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;

  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/loading.gif' alt='loading'></div>";
    insertHtml(selector, html);
  }

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }


  


  ns.LoadHome = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
      },
      false)
  }
  document.addEventListener("DOMContentLoaded", ns.LoadHome());
  ns.LoadCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHtml);
  }

  ns.loadCatalogItems = function (category) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      catalogItemsUrl + category + ".json",
      buildAndShowCatalogItemsHTML);
  }


  function buildAndShowCategoriesHtml(categories) {

    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml =
              buildCategoriesViewHtml(categories,
                categoriesTitleHtml, categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);

          },
          false);
      },
      false)
  }

  function buildCategoriesViewHtml(categories,
    categoriesTitleHtml,
    categoryHtml) {
    var finalHtml = "<div class='container'>" + categoriesTitleHtml;
    finalHtml += "<div class='our_categories'><div class='row'>";

    for (var i = 0; i < categories.length; i++) {

      var html = categoryHtml;
      var name = "" + categories[i].name;
      html = insertProperty(html, "name", name);
      finalHtml += html;
    }
    finalHtml += "</div></div></div>";
    return finalHtml;
  }

  function buildAndShowCatalogItemsHTML(categoryCatalogItems) {
    $ajaxUtils.sendGetRequest(
      catalogItemsTitleHtml,
      function (catalogItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          catalogItemHtml,
          function (catalogItemHtml) {
            var catalogItemsViewHtml = buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml);
            insertHtml("#main-content", catalogItemsViewHtml);
          },
          false)
      },
      false)
  }

  function buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml) {
    catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml,
      "name",
      categoryCatalogItems.category.name);

    var finalHtml = "<div class='container'>" + catalogItemsTitleHtml;
    finalHtml += "<div class='row'>";

    var catalogItems = categoryCatalogItems.catalog_items;
    var categoryName = categoryCatalogItems.category.name;

    for (var i = 0; i < catalogItems.length; i++) {
      var html = catalogItemHtml;
      html = insertProperty(html, "name", catalogItems[i].name);
      html = insertProperty(html, "price", catalogItems[i].price);
      html = insertProperty(html, "description", catalogItems[i].description);
      html = insertProperty(html, "categoryName", categoryName);


      html =
        InStock(html, "inStock", catalogItems[i].instock);


      finalHtml += html;
    }
    finalHtml += "</div></div>";
    return finalHtml;
    console.log(finalHtml);
  }

  function InStock(html, inStockPromName, inStockValue) {
    if (inStockValue) {
      html = insertProperty(html, "inStock", "Є в наявності");
    }
    else {
      html = insertProperty(html, "inStock", "Немає в наявності");
    }
    return html;
  }

  global.$ns = ns;
})(window)