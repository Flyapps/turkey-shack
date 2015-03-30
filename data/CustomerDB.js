/**
 * ...
 * @author Danny Marcowitz
 *		   Dor Hanin
 *         @Double Duck
 */

 var allCustomers =
 	{"customers": [{
		"id": "girl",
		"waitFactor": 1.1,
		"tip": 10,
		"spritesheet": "images/session/customers/girl.png",
		"frameWidth": 97,
		"frameHeight": 121,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "japanese",
		"waitFactor": 0.8,
		"tip": 17,
		"spritesheet": "images/session/customers/japanese.png",
		"frameWidth": 134,
		"frameHeight": 132,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "mario",
		"waitFactor": 0.9,
		"tip": 14,
		"spritesheet": "images/session/customers/man1.png",
		"frameWidth": 135,
		"frameHeight": 133,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "hipster",
		"waitFactor": 1.2,
		"tip": 8,
		"spritesheet": "images/session/customers/man2.png",
		"frameWidth": 126,
		"frameHeight": 140,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "albert",
		"waitFactor": 1.2,
		"tip": 12,
		"spritesheet": "images/session/customers/old_man.png",
		"frameWidth": 124,
		"frameHeight": 118,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,	
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "classyWoman",
		"waitFactor": 1,
		"tip": 13,
		"spritesheet": "images/session/customers/woman1.png",
		"frameWidth": 111,
		"frameHeight": 145,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}, {
		"id": "businessWoman",
		"waitFactor": 0.9,
		"tip": 20,
		"spritesheet": "images/session/customers/woman2.png",
		"frameWidth": 117,
		"frameHeight": 152,
		"idleFrame": 0,
		"angryFrame": 3,
		"satisfiedFrame": 4,
		"arrivingFrame": 0,
		"pissedOff1": 1,
		"pissedOff2": 2,
		"pissedOff3": 3
	}]
};

function CustomerDB() {
}

CustomerDB.prototype.getAllCustomers = function() {
	return allCustomers.customers;
}