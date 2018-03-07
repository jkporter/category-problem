"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var categoriesDataSource = [{
        categoryId: 100,
        parentCategoryId: -1,
        name: "Business",
        keyword: "Money"
    }, {
        categoryId: 200,
        parentCategoryId: -1,
        name: "Tutoring",
        keyword: "Teaching"
    }, {
        categoryId: 101,
        parentCategoryId: 100,
        name: "Accounting",
        keyword: "Taxes"
    }, {
        categoryId: 102,
        parentCategoryId: 100,
        name: "Taxation"
    }, {
        categoryId: 201,
        parentCategoryId: 200,
        name: "Computer"
    }, {
        categoryId: 103,
        parentCategoryId: 101,
        name: "Corporate Tax",
    }, {
        categoryId: 202,
        parentCategoryId: 201,
        name: "Operating System"
    }, {
        categoryId: 109,
        parentCategoryId: 101,
        name: "Small business Tax"
    }];
var categoriesById = categoriesDataSource.reduce(function (previousValue, currentValue) {
    previousValue[currentValue.categoryId] = currentValue;
    currentValue['_keyword'] = currentValue.keyword;
    Object.defineProperty(currentValue, 'keyword', {
        get: function () {
            if (currentValue['_keyword'])
                return currentValue['_keyword'];
            for (var i = currentValue.hierarchy.length - 1; i >= 0; i++) {
                if (categoriesById[currentValue.hierarchy[i]].keyword)
                    return categoriesById[currentValue.hierarchy[i]].keyword;
            }
            return null;
        }
    });
    return previousValue;
}, {});
function setHierarchy(c) {
    var parentCategory = categoriesById[c.parentCategoryId];
    if (parentCategory) {
        if (!(parentCategory.hierarchy))
            setHierarchy(parentCategory);
        c.hierarchy = parentCategory.hierarchy.concat(parentCategory.categoryId);
    }
    else {
        c.hierarchy = [];
    }
}
Object.keys(categoriesById).forEach(function (k) {
    setHierarchy(categoriesById[k]);
});
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Category ID:', function (answer) {
    var category = categoriesById[answer];
    if (!category)
        console.log("Category not found 😞");
    else
        console.log("ParentCategoryID=" + category.parentCategoryId + ", Name=" + category.name + ", Keywords=" + category.keyword);
    console.log();
    rl.question('Category level:', function (answer) {
        var categoriesAtLevel = Object.keys(categoriesById).map(function (key) { return categoriesById[key]; }).filter(function (category) { return category.hierarchy.length === parseInt(answer) - 1; }).map(function (category) { return category.categoryId; });
        console.log(categoriesAtLevel.join(", "));
        rl.close();
    });
});
//# sourceMappingURL=app.js.map