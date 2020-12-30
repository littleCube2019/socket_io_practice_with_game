var num_message = 0;
var MAX_MESSAGE = 22;

//This is an API for you , 
//you DO NOT need to understand how it works.
//You just need to know how to use it.
function addMessage(Text){
	if(num_message>= MAX_MESSAGE){
		$("#message div:nth-child(1)").remove();
	}

	if(num_message %2 ==0){
		$("#message").append("<div style=\"background-color:#F0F8FF\">"+Text+"</div>");
	} 
	else{
		$("#message").append("<div style=\"background-color:#DCDCDC\">"+Text+"</div>");
	}
	num_message+=1;
}

// here is an example for you
$(function(){
	$("#gather").click(()=>{
		console.log("A");
		resource["food"] += gather_food["amount"] += person["lv"];
		person["stamina"] -= gather_food["stamina"];
		person["exp"] += gather_food["exp"];
		time["hour"] += gather_food["hour"];
		addMessage("你在路邊採集了一些漿果");
		socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
	})
	$("#hunt").click(()=>{
		if(item["knife"]["have"]==1){
			resource["food"] += hunt["amount"] + person["lv"]*3;
			person["stamina"] -= hunt["stamina"];
			person["exp"] += hunt["exp"];
			time["hour"] += hunt["hour"];
			addMessage("你前往森林打獵");
			if(Math.floor(Math.random()*Math.floor(person["lv"]/2)==0)){
				addMessage("你遇到野生黑熊");
				addMessage("你拚命奔跑，消耗大量體力");
				person["stamina"] -= 40;
			}
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("需要石刀");
	})
	$("#pick-wood").click(()=>{
		resource["wood"] += pick_wood["amount"] + person["lv"];
		person["stamina"] -= pick_wood["stamina"];
		person["exp"] += pick_stone["exp"];
		time["hour"] += pick_wood["hour"];
		addMessage("你在路上撿了一些小樹枝");
		socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
	})
	$("#chop-wood").click(()=>{
		if(item["axe"]["have"]==1){
			resource["wood"] += chop_wood["amount"] + person["lv"]*3;
			person["stamina"] -= chop_wood["stamina"];
			person["exp"] += chop_wood["exp"];
			time["hour"] += chop_wood["hour"];
			addMessage("你砍了一棵樹");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("需要斧頭");
	})
	$("#pick-stone").click(()=>{
		resource["stone"] += pick_stone["amount"] + person["lv"];
		person["stamina"] -= pick_stone["stamina"];
		person["exp"] += pick_wood["exp"];
		time["hour"] += pick_stone["hour"];
		addMessage("你在路上撿了一些小石頭");
		socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
	})
	$("#dig-stone").click(()=>{
		if(item["pickaxe"]["have"]==1){
			resource["stone"] += mine_stone["amount"] + person["lv"]*3;
			person["stamina"] -= mine_stone["stamina"];
			person["exp"] += mine_stone["exp"];
			time["hour"] += mine_stone["hour"];
			addMessage("你挖了一些石頭");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("需要十字搞");
	})
	$("#beach").click(()=>{
		if(resource["wood"]>=beach["wood"]){
			resource["wood"] -= beach["wood"];
			time["hour"] += beach["hour"];
			addMessage("你點燃了狼煙");
			if(time["day"]%7==0 && Math.floor(Math.random()*2)==0){
				socket.emit("escape");
			}
			else{
				addMessage("甚麼事都沒發生");
			}
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})

	$("#daily-routine").click(()=>{
		if(time["hour"]>18){
			$("#daily-routine").hide();
			addMessage("天色太黑了，你只想待在營地裡");
		}
	})
})

$(()=>{
	$("#eating").click(()=>{
		if(resource["food"]>0){
			person["stamina"] += 5;
			if(person["stamina"]>100) person["stamina"] = 100;
			person["health"] -= 5;
			resource["food"] -= 1;
			addMessage("你吃了一些東西，肚子感覺怪怪的");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else{
			addMessage("你沒有東西可以吃");
		}
	})
	$("#cook").click(()=>{
		if(item["campfire"]["have"]==1){
			if(resource["food"]>0){
				person["stamina"] += 10;
				if(person["stamina"]>100) person["stamina"] = 100;
				person["health"] += 5;
				if(person["health"]>100) person["health"] = 100;
				resource["food"] -= 1;
				addMessage("你飽餐一頓");
				socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
			}
			else{
				addMessage("你沒有東西可以吃");
			}
		}
		else addMessage("需要營火");
	})
	$("#sleep").click(()=>{
		if(item["stonehouse"]["have"]==1){
			person["stamina"] += 30;
			addMessage("你睡在堅固的石頭屋裡，回復了較多體力");
		}
		else if(item["woodhouse"]["have"]==1){
			person["stamina"] += 20;
			addMessage("你睡在破舊的木屋裡，回復了一些體力");
		}
		else{
			person["stamina"] += 10;
			addMessage("你睡在路邊，回復了少許體力");
		}
		if(person["stamina"]>60) person["stamina"] = 60;
		time["day"] += 1;
		time["hour"] = 6;
		
		socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		$("#daily-routine").show();
	})
})

$(()=>{
	$("#axe").click(()=>{
		if(resource["stone"] >= item["axe"]["stone"] && resource["wood"] >= item["axe"]["wood"]){
			resource["stone"] -= item["axe"]["stone"];
			resource["wood"] -= item["axe"]["wood"];
			item["axe"]["have"] = 1;
			$("#axe").hide();
			$("#item").append("斧頭");
			addMessage("你製作了一把斧頭");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
	$("#pickaxe").click(()=>{
		if(resource["stone"] >= item["pickaxe"]["stone"] && resource["wood"] >= item["pickaxe"]["wood"]){
			resource["stone"] -= item["pickaxe"]["stone"];
			resource["wood"] -= item["pickaxe"]["wood"];
			item["pickaxe"]["have"] = 1;
			$("#pickaxe").hide();
			$("#item").append("十字搞");
			addMessage("你製作了一把十字搞");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
	$("#campfire").click(()=>{
		if(resource["stone"] >= item["campfire"]["stone"] && resource["wood"] >= item["campfire"]["wood"]){
			resource["stone"] -= item["campfire"]["stone"];
			resource["wood"] -= item["campfire"]["wood"];
			item["campfire"]["have"] = 1;
			$("#campfire").hide();
			$("#item").append("營火");
			addMessage("你製作了一個營火");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
	$("#woodhouse").click(()=>{
		if(resource["wood"] >= item["woodhouse"]["wood"]){
			resource["wood"] -= item["campfire"]["wood"];
			item["woodhouse"]["have"] = 1;
			$("#woodhouse").hide();
			$("#item").append("木屋");
			addMessage("你製作了一間木屋");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
	$("#stonehouse").click(()=>{
		if(resource["stone"] >= item["stonehouse"]["stone"]){
			resource["stone"] -= item["stonehouse"]["stone"];
			item["stonehouse"]["have"] = 1;
			$("#stonehouse").hide();
			$("#item").append("石頭屋");
			addMessage("你製作了一間石頭屋");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
	$("#knife").click(()=>{
		if(resource["stone"] >= item["knife"]["stone"]){
			resource["stone"] -= item["knife"]["stone"];
			item["knife"]["have"] = 1;
			$("#knife").hide();
			$("#item").append("石刀");
			addMessage("你製作了一把石刀");
			socket.emit("update", time["day"], time["hour"], person["stamina"], person["health"], person["exp"], resource["wood"], resource["stone"], resource["food"]);
		}
		else addMessage("你沒有足夠的資源");
	})
})