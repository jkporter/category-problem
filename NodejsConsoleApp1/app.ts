import * as readline from 'readline';

interface Category {
    categoryId: number;
    parentCategoryId: number;
    name: string
    keyword: string;
    hierarchy: number[];
}

const categoriesDataSource = [{
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
}]

// Create a dictionary
const categoriesById: { [categoryId: number]: Category; } = categoriesDataSource.reduce((previousValue, currentValue : Category) => {
    previousValue[currentValue.categoryId] = currentValue;
    currentValue['_keyword'] = currentValue.keyword;

    // Convenience, but larger dataset we can define this once on class prototype
    Object.defineProperty(currentValue, 'keyword', {
        get() {
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

// For perfromance typically this type of data would generated at insert in the
// datastore for large hierarchies can't (or shouldn't) be nested natively
Object.keys(categoriesById).forEach((key) => {
    function setHierarchy(c: Category) {
        const parentCategory: Category = categoriesById[c.parentCategoryId];
        if (parentCategory) {
            if (!(parentCategory.hierarchy))
                setHierarchy(parentCategory);
            c.hierarchy = parentCategory.hierarchy.concat(parentCategory.categoryId);
        }
        else {
            c.hierarchy = [];
        }
    }
    setHierarchy(categoriesById[key]);
});

const rl =  readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Category ID:', (answer) => {
    var category = categoriesById[answer];
    if (!category)
        console.log("Category not found 😞");
    else
        console.log(`ParentCategoryID=${category.parentCategoryId}, Name=${category.name}, Keywords=${category.keyword}`);

    console.log();

    rl.question('Category level:', (answer) => {
        var categoriesAtLevel = Object.keys(categoriesById)
            .map((key) => categoriesById[key])
            .filter(category => category.hierarchy.length === parseInt(answer) - 1)
            .map(category => category.categoryId);

        if (categoriesAtLevel.length === 0)
            console.log("No categories found 😞")
        else
            console.log(categoriesAtLevel.join(", "));

        rl.close();
    });
});