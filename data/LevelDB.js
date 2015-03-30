/**
 * ...
 * @author Danny Marcowitz
 *		   Dor Hanin
 *         @Double Duck
 */

 var allLevels = {
 	"levels": [
 		{
			// Level 1
			"id": "1",
			"duration": 45,
			"maxCustomersAtOnce": 1,
			"toppings":[],
			"liquids":[], 
			"customerWait":35,
			"timeBetweenCustomers":1,
			"maxRecipeSize":1,
			"stars": [25, 50, 75],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 2
			"id": "2",
			"duration": 45,
			"maxCustomersAtOnce": 2,
			"toppings":[],
			"liquids":[], 
			"customerWait":35,
			"timeBetweenCustomers":3,
			"maxRecipeSize":3,
			"stars": [40, 80, 120],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 3
			"id": "3",
			"duration": 50,
			"maxCustomersAtOnce": 3,
			"toppings":[],
			"liquids":[], 
			"customerWait":30,
			"timeBetweenCustomers":3,
			"maxRecipeSize":4,
			"stars": [70, 120, 170],
			"pizzaCookDuration": 11
		}, 
 		{
			// Level 4
			"id": "4",
			"duration": 60,
			"maxCustomersAtOnce": 2,
			"toppings":["olives", "onion"],
			"liquids":[], 
			"customerWait":35,
			"timeBetweenCustomers":3,
			"maxRecipeSize":1,
			"stars": [100, 150, 200],
			"pizzaCookDuration": 11
		}, 
 		{
			// Level 5
			"id": "5",
			"duration": 65,
			"maxCustomersAtOnce": 2,
			"toppings":["olives", "onion", "mushrooms"],
			"liquids":[], 
			"customerWait":35,
			"timeBetweenCustomers":4,
			"maxRecipeSize":2,
			"stars": [120, 200, 280],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 6
			"id": "6",
			"duration": 65,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms"],
			"liquids":[], 
			"customerWait":30,
			"timeBetweenCustomers":3,
			"maxRecipeSize":4,
			"stars": [150, 250, 350],
			"pizzaCookDuration": 11
		}, 
 		{
			// Level 7
			"id": "7",
			"duration": 70,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms"],
			"liquids":["orange"], 
			"customerWait":35,
			"timeBetweenCustomers":4,
			"maxRecipeSize":4,
			"stars": [150, 300, 450],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 8
			"id": "8",
			"duration": 80,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":35,
			"timeBetweenCustomers":6,
			"maxRecipeSize":4,
			"stars": [150, 300, 450],
			"pizzaCookDuration": 11
		}, 
 		{
			// Level 9
			"id": "9",
			"duration": 80,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":35,
			"timeBetweenCustomers":5,
			"maxRecipeSize":3,
			"stars": [180, 350, 520],
			"pizzaCookDuration": 11
		}, 
 		{
			// Level 10
			"id": "10",
			"duration": 90,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":5,
			"maxRecipeSize":3,
			"stars": [200, 450, 700],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 11
			"id": "11",
			"duration": 90,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":35,
			"timeBetweenCustomers":4,
			"maxRecipeSize":3,
			"stars": [250, 550, 800],
			"pizzaCookDuration": 9
		}, 
 		{
			// Level 12
			"id": "12",
			"duration": 100,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":35,
			"timeBetweenCustomers":5,
			"maxRecipeSize":3,
			"stars": [250, 600, 850],
			"pizzaCookDuration": 10
		}, 
 		{
			// Level 13
			"id": "13",
			"duration": 100,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":32,
			"timeBetweenCustomers":3,
			"maxRecipeSize":3,
			"stars": [400, 700, 950],
			"pizzaCookDuration": 8
		}, 
 		{
			// Level 14
			"id": "14",
			"duration": 110,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":32,
			"timeBetweenCustomers":3,
			"maxRecipeSize":3,
			"stars": [600, 800, 1150],
			"pizzaCookDuration": 8
		}, 
 		{
			// Level 15
			"id": "15",
			"duration": 90,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":34,
			"timeBetweenCustomers":3,
			"maxRecipeSize":3,
			"stars": [600, 800, 1000],
			"pizzaCookDuration": 8
		},
		{
			// Level 16
			"id": "16",
			"duration": 120,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":33,
			"timeBetweenCustomers":3,
			"maxRecipeSize":3,
			"stars": [700, 900, 1200],
			"pizzaCookDuration": 8
		},
		{
			// Level 17
			"id": "17",
			"duration": 120,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":33,
			"timeBetweenCustomers":2,
			"maxRecipeSize":3,
			"stars": [70, 900, 1400],
			"pizzaCookDuration": 8
		},
		{
			// Level 18
			"id": "18",
			"duration": 100,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":33,
			"timeBetweenCustomers":2,
			"maxRecipeSize":3,
			"stars": [700, 900, 1300],
			"pizzaCookDuration": 8
		},
		{
			// Level 19
			"id": "19",
			"duration": 140,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":32,
			"timeBetweenCustomers":3,
			"maxRecipeSize":4,
			"stars": [700, 1100, 1500],
			"pizzaCookDuration": 8
		},
		{
			// Level 20
			"id": "20",
			"duration": 140,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":3,
			"maxRecipeSize":4,
			"stars": [800, 1400, 1700],
			"pizzaCookDuration": 7
		},
		{
			// Level 21
			"id": "21",
			"duration": 120,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":2,
			"maxRecipeSize":4,
			"stars": [800, 1100, 1500],
			"pizzaCookDuration": 7
		},
		{
			// Level 22
			"id": "22",
			"duration": 110,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":2,
			"maxRecipeSize":4,
			"stars": [800, 1100, 1400],
			"pizzaCookDuration": 7
		},
		{
			// Level 23
			"id": "23",
			"duration": 100,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":2,
			"maxRecipeSize":4,
			"stars": [800, 1000, 1300],
			"pizzaCookDuration": 7
		},
		{
			// Level 24
			"id": "24",
			"duration": 100,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":1,
			"maxRecipeSize":3,
			"stars": [800, 1100, 1400],
			"pizzaCookDuration": 7
		},
		{
			// Level 25
			"id": "25",
			"duration": 90,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":31,
			"timeBetweenCustomers":1,
			"maxRecipeSize":3,
			"stars": [800, 1000, 1200],
			"pizzaCookDuration": 7
		},
		{
			// Level 26
			"id": "26",
			"duration": 90,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":2,
			"maxRecipeSize":3,
			"stars": [800, 1000, 1200],
			"pizzaCookDuration": 6
		},
		{
			// Level 27
			"id": "27",
			"duration": 140,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":2,
			"maxRecipeSize":3,
			"stars": [800, 1400, 1700],
			"pizzaCookDuration": 6
		},
		{
			// Level 28
			"id": "28",
			"duration": 150,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":1,
			"maxRecipeSize":4,
			"stars": [800, 1000, 1800],
			"pizzaCookDuration": 6
		},
		{
			// Level 29
			"id": "29",
			"duration": 160,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":1,
			"maxRecipeSize":4,
			"stars": [1100, 1500, 2000],
			"pizzaCookDuration": 6
		},
		{
			// Level 30
			"id": "30",
			"duration": 170,
			"maxCustomersAtOnce": 3,
			"toppings":["olives", "onion", "mushrooms", "pineapple", "pepperoni"],
			"liquids":["orange", "red", "lime"], 
			"customerWait":30,
			"timeBetweenCustomers":1,
			"maxRecipeSize":4,
			"stars": [1200, 1600, 2100],
			"pizzaCookDuration": 6
		},
	]
}

var allHelpScreens = {
 	"helpScreens": [
 		{
			// Basic mechanics
			"fromLevel": 1,
			"toLevel": 1,
			"availableScreens":[1, 2],
			"focusOn": 1
		},
		{
			// Baking multiple pizzas at once
			"fromLevel": 2,
			"toLevel": 3,
			"availableScreens":[1, 2, 3],
			"focusOn": 3
		},
		{
			// Toppings
			"fromLevel": 4,
			"toLevel": 6,
			"availableScreens":[1, 2, 3, 4],
			"focusOn": 4
		},
		{
			// Drinks
			"fromLevel": 7,
			"toLevel": 7,
			"availableScreens":[1, 2, 3, 4, 5],
			"focusOn": 5
		},
		{
			// Now you are ready!
			"fromLevel": 8,
			"toLevel": 20,
			"availableScreens":[1, 2, 3, 4, 5, 6],
			"focusOn": 6
		}
	]
}

// Tip
var tipFactorCooking = 0.7;
var tipFactorTime = 0.3;

// Pizza Price
var basePizza = 50;
var eachTopping = 2;
var drink = 5;

function LevelDB() {
}

LevelDB.prototype.getTipFactorCooking = function() {
	return tipFactorCooking;
}

LevelDB.prototype.getTipFactorTime = function() {
	return tipFactorTime;
}

LevelDB.prototype.getAllLevels = function() {
	return allLevels.levels;
}

LevelDB.prototype.getPizzaPrice = function() {
	return basePizza;
}

LevelDB.prototype.getToppingPrice = function() {
	return eachTopping;
}

LevelDB.prototype.getDrinkPrice = function() {
	return drink;
}

LevelDB.prototype.getAllHelpScreens = function() {
	return allHelpScreens.helpScreens;
}