// Sample 1.

// ❌ Bad Code
function getResult1(score) {
    let result;
    if(score > 5) {
        result = '👍';
    } else if (score <= 5) {
        result = '👎';
    }
    return result;
}

// ✅ Good Code ✨
function getResult2(score) {
    return score > 5 ? '👍' & console.log("최고다") : '👎'; 
}

function printFunction(score) {
    console.log(getResult2(score));
}

printFunction(10);

// Sample 2. Nullish coalescing operator

// ❌ Bad Code
function printMessage(text) {
    let message = text;
    if (text == null || text == undefined) {
        message = 'Nothing to display 😛';
    }
    console.log(message);
}


// ✅ Good Code ✨
function printMessageByNullish(text) {
    const message = text ?? 'Nothing to display 😛';
    console.log(message);
}

// 🚨 Default Parameter is only for undefiend
function printMessageByDefaultParameter(text = 'Nothing to display 😛') {
    console.log(text);
}

// 🚨 Logical OR operator - in case text is falsy(false, 0, -0, NaN, null, undefined, "", '', ``)
function printMessageByLogical(text) {
    const message = text || 'Nothing to display 😛';
    console.log(message);
}

// Sample 2. Test
// printMessage(null);
// printMessage(undefined);
// printMessage('This is comment1');
// printMessageByNullish(null);
// printMessageByNullish(undefined);
// printMessageByNullish('This is comment2');
// printMessageByDefaultParameter(undefined);
// printMessageByDefaultParameter(null);
// printMessageByDefaultParameter('Hello');
printMessageByLogical('Hello');
printMessageByLogical(undefined);
printMessageByLogical(null);
printMessageByLogical(0);
printMessageByLogical('');

// Sample 3. object-destructuring

// Object Destructuring
const person = {
    name: 'Julia',
    age: 20,
    phone: '0107777777',
};

// ❌ Bad Code
function displayPerson(person) {
    displayAvatar(person.name);
    displayName(person.name);
    displayProfile(person.name, person.age);
}

// ❌ Bad Code
function displayPersonByConst(person) {
    const name = person.name;
    const age = person.age;
    displayAvatar(name);
    displayName(name);
    displayProfile(name, age);
}

// ✅ Good Code ✨
function displayPersonByObject(person) {
    const {name, age} = person; //person 객체의 키와 동일한 값을 사용
    displayAvatar(name);
    displayName(name);
    displayProfile(name, age);
}

// Sample 4. Spread Syntax - Object
// item과 detail을 한번에 묶을 수 있는 방법은??
const item = { type: '👔', size: 'M' };
const detail = { price: 20, made: 'Korea', gender: 'M' }

// ❌ Bad Code 4-1. item에 detail에 있는 key-value를 수동으로 하나하나 매핑해줄 수는 있다.
item['price'] = detail.price;

// ❌ Bad Code 4-2. 기존 객체를 mutaion 하지 않고 새로운 객체를 만들어서 할당 할 수도 있다.
const newObject = new Object();
newObject['type'] = item.type;
newObject['size'] = item.size;
newObject['price'] = detail.price;
newObject['made'] = detail.made;
newObject['gender'] = detail.gender;

// ❌ Bad Code 4-3
const newObject2 = {
    type: item.type,
    size: item.size,
    price: detail.price,
    made: detail.made,
    gender: detail.gender,
};

// ✅ Good Code ✨
const shirt0 = Object.assign(item, detail);

// ✅ Better! Code ✨
// detail에 있는 price의 값을 업데이트 하고 싶다면?? 뒤에서 업데이트 할 수 있다.
const shirt = {...item, ...detail};
const shirtByUpdate = {...item, ...detail, price: 40};

console.log(shirt);
console.log(shirtByUpdate);

// Spread Syntax - Array
let fruits = ['🍉', '🍊', '🍌'];

// fruits.push('🍓');
fruits = [...fruits, '🍓']; // 배열의 끝에 값을 추가할 때
fruits = ['🍇', ...fruits]; // 배열의 시작에 값을 추가할 때
console.log(fruits);

const fruits2 = ['🍑', '🍈', '🍍'];
let combined = fruits.concat(fruits2); // 두 배열을 합칠 때
combined = [...fruits, '🍒', ...fruits2]; // 두 배열 사이에 값을 넣고 싶을 때
console.log(combined);

// Sample 5. Optional Chaining

const bob = {
    name: 'Julia',
    age: '20',
};
const anna = {
    name: 'Julia',
    age: 20,
    job: {
        title: 'Software Engineer',
    },
};

// ❌ Bad Code
function displayJobTitle(person) {
    if (person.job && person.job.title){
        console.log(person.job.title);
    }
}

// ✅ Good Code ✨
function displayJobTitleGood(person) {
    if (person.job?.title) {
        console.log(person.job.title);
    }
}

// ✅ Better! Code ✨
function displayJobTitleBetter(person) {
    const title = person.job?.title ?? 'No Job Yet 🔥';
    console.log(title);
}

// Sample 6. Template Literals (Template String)
const newPerson = {
    name: 'Julia',
    score: 4,
};

// ❌ Bad Code
console.log('Hello ' + newPerson.name + ', Your current score is ' + newPerson.score);

// ✅ Good Code ✨
const {name, score} = newPerson;
console.log(`Hello ${name}, Your current score is ${score}`);

// ✅ Better! Code ✨ 함수화하기
function greetings(newPerson) {
    const {name, score} = newPerson;
    console.log(`Hello ${name}, Your current score is ${score}`);
}

// Sample 7. 
// Looping 짝수인 경우 4를 곱한 뒤, 총 합은?
const items = [1,2,3,4,5,6];

// ❌ Bad Code
function calculate(items) {
    const sum = 0;
    for(let n in items) {
        if(n%2==0) {
            sum += n*4;
        }
    }
    return sum;
}

// ✅ Good Code ✨ 함수 단위로 쪼개기
function getAllEvens(items) {
    return items.filter(num => num%2 === 0);
}

function multiplybyFore(items) {
    return items.map(num => num*4);
}

function sumArray(items) {
    items.reduce((a,b) => a + b, 0);
}

// ✅ Good Code ✨ 함수로 따로 두지 않고, 바로 처리
const evens = items.filter((num) => num % 2 === 0);
const multiple = evens.map((num) => num * 4);
const sum = multiple.reduce((a,b) => a + b, 0);
console.log(sum);

// ✅ Good Code ✨ 체이닝
const result = items
    .filter((num) => num % 2 === 0)
    .map((num) => num * 4)
    .reduce((a,b) => a + b, 0);
console.log(result);

