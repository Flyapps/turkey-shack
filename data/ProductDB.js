/**
 * ...
 * @author Danny Marcowitz
 *		   Dor Hanin
 *         @Double Duck
 */

 var allToppings = {"toppings": [
				{"id": "1", "name":"olives","deskIcon": "images/session/desk/toppings/olives.png", "custIconFrame": 1 , "onPizza": "images/session/desk/desk_pizza/olives.png", "ovenIconFrames":[3]},
				{"id": "2", "name":"mushrooms","deskIcon": "images/session/desk/toppings/mushrooms.png", "custIconFrame": 0, "onPizza": "images/session/desk/desk_pizza/mushroom.png", "ovenIconFrames":[4]},
				{"id": "3", "name":"onion","deskIcon": "images/session/desk/toppings/onion.png", "custIconFrame": 2, "onPizza": "images/session/desk/desk_pizza/onion.png", "ovenIconFrames":[2]},
				{"id": "4", "name":"pepperoni","deskIcon": "images/session/desk/toppings/pepperoni.png", "custIconFrame": 3, "onPizza": "images/session/desk/desk_pizza/pepperoni.png", "ovenIconFrames":[0]},
				{"id": "5", "name":"pineapple","deskIcon": "images/session/desk/toppings/ananas.png", "custIconFrame": 4, "onPizza": "images/session/desk/desk_pizza/pineapple.png", "ovenIconFrames":[1]},
    ]
};

var allLiquids =
	{"liquids": [{
		"id": "1",
		"name":"orange",
		"bigIcon": "images/session/desk/drink1.png",
		"smallIcon": "images/session/customers/bubbles/drink1.png",
	}, {
		"id": "2",
		"name":"lime",
		"bigIcon": "images/session/desk/drink2.png",
		"smallIcon": "images/session/customers/bubbles/drink2.png",
	}, {
		"id": "3",
		"name":"red",
		"bigIcon": "images/session/desk/drink3.png",
		"smallIcon": "images/session/customers/bubbles/drink3.png",
	}]
};

function ProductDB() {
}

ProductDB.prototype.getAllToppings = function() {
	return allToppings.toppings;
}

ProductDB.prototype.getAllLiquids = function() {
	return allLiquids.liquids;
}