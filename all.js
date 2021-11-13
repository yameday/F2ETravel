window.onload=function(){
	document.querySelector('#exampleModalLabel').innerHTML = "TITLE";
	//document.querySelector('.modal-body').innerHTML = '<iframe width="100%" height="250" loading="lazy" src="https://maps.google.com/maps?q=帆+船+鼻+大+草+原&amp;hl=zh-TW&amp;z=16&amp;output=embed" ></iframe>';
	var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
	  keyboard: false
	})
	

	let mainHotspotCard = document.querySelector('.main-hotspot-card');
	mainHotspotCard.addEventListener('click', function() {
		// this.querySelector('.select').classList.toggle('open');
		//console.log("DD");
		//alert("DDD");
		myModal.show();
	})

	//綁定btnC click 事件
   let btnCity = document.querySelector('#btnC');
	btnCity.addEventListener('click', function() {
   // this.querySelector('.select').classList.toggle('open');
   let areaGroupSelect = document.querySelector('.area-group-select');
   let circleDownIcon = document.querySelector('.fa-chevron-circle-down');
   areaGroupSelect.classList.toggle('area-group-select-show');
   circleDownIcon.classList.toggle('down');
   
	})
	
	//綁定搜尋按鈕事件
	let btnSearch = document.querySelector('#btnSearch');
	btnSearch.addEventListener('click', function() {
		// this.querySelector('.select').classList.toggle('open');
		let areaChooseEl = document.querySelector('#area-choose');
		let city = areaChooseEl.dataset.area;
		let keywordInputEl = document.querySelector('#keywordInput');
		let keyword = keywordInputEl.value;
		
		keywordSearch(city,keyword);
		showSearchPanel();
		
	})
	
	//綁定更多XX按鈕事件	
	let btnMore = document.getElementsByClassName("main-hotspot-text-link");	
	//console.log(drowdownElements);
	let myFunctionMore = function(e) {
		//e.preventDefault();
		//moreSearch(this.dataset.flag);// 連API要打開
		showSearchPanel();
	};
	for (let i = 0; i < btnMore.length; i++) {
		btnMore[i].addEventListener('click', myFunctionMore, false);
	}
	
		
	//綁定 選取區域事件
	let drowdownElements = document.getElementsByClassName("drowdown-item");	
	//console.log(drowdownElements);
	let myFunction = function() {
		//var attribute = this.getAttribute("class");
		let attribute = this.textContent;
		let areaGroupSelectS = document.querySelector('.area-group-select-show');
		areaGroupSelectS.classList.toggle('area-group-select-show');
		
		let elems = document.getElementsByClassName("active");		
		[].forEach.call(elems, function(el) {
			el.classList.remove("active");
		});
		//drowdownElements.classList.remove('active');
		this.classList.toggle('active');
		let areaChooseElement = document.querySelector('#area-choose');
		areaChooseElement.setAttribute("value", this.textContent);
		let circleDown = document.querySelector('.fa-chevron-circle-down');
		circleDown.classList.toggle('down');
		
		document.querySelector('.main').style.display="none"; 
		document.querySelector('.main-search').style.display="block"; 
		document.querySelector('.main-search-h1').textContent = this.textContent;
		let keywordInputEl = document.querySelector('#keywordInput');
		let keyword = keywordInputEl.value;
		//alert(this.dataset.area);
		//keywordSearch(this.dataset.area,keyword);    // 連API要打開
		areaChooseElement.dataset.area = this.dataset.area;
		console.log(this.dataset.area);
		
	};
	for (let i = 0; i < drowdownElements.length; i++) {
		drowdownElements[i].addEventListener('click', myFunction, false);
	}
	
	function showSearchPanel() {
		document.querySelector('.main').style.display="none"; 
		document.querySelector('.main-search').style.display="block"; 
	}
	
	function GetAuthorizationHeader() {
		var AppID = '29426865e0284a9a98e650483ac6cbe5';
		var AppKey = '3F5VBYR0UMN5-9KiT15o63IjKi4';

		var GMTString = new Date().toGMTString();
		var ShaObj = new jsSHA('SHA-1', 'TEXT');
		ShaObj.setHMACKey(AppKey, 'TEXT');
		ShaObj.update('x-date: ' + GMTString);
		var HMAC = ShaObj.getHMAC('B64');
		var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

		return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/}; 
	}
	
	function SpotInit(){ // 無用了 可刪掉
		
		axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=3&$format=JSON', { params: { headers: GetAuthorizationHeader() } })
		  .then(function(response){
			
			let str ="";	
			let mainHotspotCards = document.querySelector('.main-hotspot-cards');		
			response.data.forEach(function(value){
				
				
				console.log(value);
				str += `<div class="card main-hotspot-card" style="width: 18rem;">				
				  <div class="main-hotspot-card-img" > 
						<img src="${value.Picture.PictureUrl1}" class="card-img-top" alt="">
				  </div>
				  <div class="card-body">
					<div><span class="card-text-title">${value.Name}</span></div>
					<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div>
					<div> <img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span></div>
				  </div>
				</div>`;
			});
			mainHotspotCards.innerHTML = str ; 
			 
			//console.log(response.data); // ex.: { user: 'Your User'}
			console.log(response.status); // ex.: 200
		  });  
	}
	
	//關鍵字搜尋
	function keywordSearch(city,keyword){
		
		let url = "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/"+city+"?$top=15&$filter=contains(Name,'"+keyword+"')&$format=JSON";
		
		if (city=="" ||city=="undefined" ){
			url = "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=15&$filter=contains(Name,'"+keyword+"')&$format=JSON";
		}
		
		axios.get(url, { params: { headers: GetAuthorizationHeader() } })
		  .then(function(response){
			
			let str ="";	
			let mainHotspotSearchCards = document.querySelector('#main-search-cards-panel');		
			response.data.forEach(function(value){
				
				let imgUrl = value.Picture.PictureUrl1;
				if (!imgUrl){
					imgUrl = 'img/no-image-found.png';
				}
				//console.log(value);
				str += `<div class="col-sm-4 mb-3 main-hotspot-search-card">
					<div class="card" style="width: 18rem;">
							   <div class="main-hotspot-card-img" > 
									<img src="${imgUrl}" class="card-img-top" alt="">
							   </div>
							  <div class="card-body">
								<div><span class="card-text-title">${value.Name}</span></div>
								<img src="img/Location_green.png" ><span class="card-text-content">${value.City}</span> <img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span>
							  </div>
					</div>
				</div>`;
			});
			mainHotspotSearchCards.innerHTML = str ; 
			document.querySelector('.main-search-h1').textContent = "搜尋結果"; 
			console.log(response.data); // ex.: { user: 'Your User'}
			console.log(response.status); // ex.: 200
		  });  
	}
	//關鍵字搜尋
	function moreSearch(indexFlag){
		
		let flagType;
		if (indexFlag =="hotspot"){
			flagType = "ScenicSpot";
		} else if (indexFlag =="activity"){
			flagType = "Activity";
		} else if (indexFlag =="restaurant"){
			flagType = "Restaurant";
		} else if (indexFlag =="hotel"){
			flagType = "Hotel";
		} else {
			alert("flag error");
			return;
		}
		
		let url = "https://ptx.transportdata.tw/MOTC/v2/Tourism/"+flagType+"?$top=15&$filter=Picture/PictureUrl1 ne null &$format=JSON";
		
		axios.get(url, { params: { headers: GetAuthorizationHeader() } })
		  .then(function(response){
			
			let str ="";	
			let mainHotspotSearchCards = document.querySelector('#main-search-cards-panel');	





			
			if (indexFlag =="hotspot"){
				
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
								<div class="card main-hotspot-card" style="width: 18rem;">
								   <div class="main-hotspot-card-img" > 
										<img src="${imgUrl}" class="card-img-top" alt="">
								   </div>
								  <div class="card-body" >
									<div><span class="card-text-title">${value.Name}</span></div>
									<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
									<div><img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span></div>
								  </div>
								</div>
								</div>`;					
					
				});
				
			} else if (indexFlag =="activity"){
				
				response.data.forEach(function(value){
				
					let date_string = value.StartTime; 
					let output = new Date(date_string);
					let formatted_date_start = output.getFullYear() + "-" + (output.getMonth() + 1) + "-" + output.getDate();
					date_string = value.EndTime; 
					output = new Date(date_string);
					let formatted_date_end = output.getFullYear() + "-" + (output.getMonth() + 1) + "-" + output.getDate();
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					
					console.log(value);
					str += `<div class="col-sm-4 mb-3">
							<div class="card main-hotspot-card" style="width: 18rem;">
							   <div class="main-hotspot-card-img" > 
									<img src="${imgUrl}" class="card-img-top" alt="">
							   </div>
							  <div class="card-body">
								<div><span class="card-text-title">${value.Name}</span></div>
								<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Location}</span></div> 
								<div><img src="img/Time_Circle.png" > <span class="card-text-content">${formatted_date_start} ~ ${formatted_date_end}</span></div>
								
							  </div>
							</div>
							</div>`;
									
					
				});
				
			} else if (indexFlag =="restaurant"){
				
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
								<div class="card main-hotspot-card" style="width: 18rem;">
								   <div class="main-hotspot-card-img" > 
										<img src="${imgUrl}" class="card-img-top" alt="">
								   </div>
								  <div class="card-body" >
									<div><span class="card-text-title">${value.Name}</span></div>
									<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
									<div><img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span></div>
								  </div>
								</div>
								</div>`;					
					
				});
				
			} else if (indexFlag =="hotel"){
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
									<div class="card main-hotspot-card" style="width: 18rem;">
										<div class="main-hotspot-card-img" > 
											<img src="${imgUrl}" class="card-img-top" alt="">
									   </div>
									  <div class="card-body">
										<div><span class="card-text-title">${value.Name}</span></div>
										<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
										<div><img src="img/Calling.png" > <span class="card-text-content">${value.Phone}</span></div>
										
									  </div>
									</div>
								
								</div>	`;												
					
				});
			} else {
				alert("axios error");
				return;
			}						
			
						
			
			
			
			
			mainHotspotSearchCards.innerHTML = str ; 
			document.querySelector('.main-search-h1').textContent = "更多搜尋結果"; 
			
		  });  
	}
	
	
	
	// 首頁初始化		
	function indexInit(indexFlag){
		
		let flagType;
		if (indexFlag =="hotspot"){
			flagType = "ScenicSpot";
		} else if (indexFlag =="activity"){
			flagType = "Activity";
		} else if (indexFlag =="restaurant"){
			flagType = "Restaurant";
		} else if (indexFlag =="hotel"){
			flagType = "Hotel";
		} else {
			alert("flag error");
			return;
		}
		
		let url = "https://ptx.transportdata.tw/MOTC/v2/Tourism/"+flagType+"?$top=3&$filter=Picture/PictureUrl1 ne null &$format=JSON";
				
		axios.get( url, { params: { headers: GetAuthorizationHeader() } })
		  .then(function(response){
			
			let str ="";	
			let mainCardsEl = document.querySelector('.main-'+indexFlag+'-cards');		
			
			if (indexFlag =="hotspot"){
				
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
								<div class="card main-hotspot-card" style="width: 18rem;">
								   <div class="main-hotspot-card-img" > 
										<img src="${imgUrl}" class="card-img-top" alt="">
								   </div>
								  <div class="card-body" >
									<div><span class="card-text-title">${value.Name}</span></div>
									<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
									<div><img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span></div>
								  </div>
								</div>
								</div>`;					
					
				});
				
			} else if (indexFlag =="activity"){
				
				response.data.forEach(function(value){
				
					let date_string = value.StartTime; 
					let output = new Date(date_string);
					let formatted_date_start = output.getFullYear() + "-" + (output.getMonth() + 1) + "-" + output.getDate();
					date_string = value.EndTime; 
					output = new Date(date_string);
					let formatted_date_end = output.getFullYear() + "-" + (output.getMonth() + 1) + "-" + output.getDate();
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					
					console.log(value);
					str += `<div class="col-sm-4 mb-3">
							<div class="card main-hotspot-card" style="width: 18rem;">
							   <div class="main-hotspot-card-img" > 
									<img src="${imgUrl}" class="card-img-top" alt="">
							   </div>
							  <div class="card-body">
								<div><span class="card-text-title">${value.Name}</span></div>
								<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Location}</span></div> 
								<div><img src="img/Time_Circle.png" > <span class="card-text-content">${formatted_date_start} ~ ${formatted_date_end}</span></div>
								
							  </div>
							</div>
							</div>`;
									
					
				});
				
			} else if (indexFlag =="restaurant"){
				
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
								<div class="card main-hotspot-card" style="width: 18rem;">
								   <div class="main-hotspot-card-img" > 
										<img src="${imgUrl}" class="card-img-top" alt="">
								   </div>
								  <div class="card-body" >
									<div><span class="card-text-title">${value.Name}</span></div>
									<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
									<div><img src="img/Time_Circle.png" > <span class="card-text-content">${value.OpenTime}</span></div>
								  </div>
								</div>
								</div>`;					
					
				});
				
			} else if (indexFlag =="hotel"){
				response.data.forEach(function(value){
					
					let imgUrl = value.Picture.PictureUrl1;
					if (!imgUrl){
						imgUrl = 'img/no-image-found.png';
					}
					//console.log(value);
					str += `	<div class="col-sm-4 mb-3">
									<div class="card main-hotspot-card" style="width: 18rem;">
										<div class="main-hotspot-card-img" > 
											<img src="${imgUrl}" class="card-img-top" alt="">
									   </div>
									  <div class="card-body">
										<div><span class="card-text-title">${value.Name}</span></div>
										<div><img src="img/Location_green.png" ><span class="card-text-content">${value.Address}</span></div> 
										<div><img src="img/Calling.png" > <span class="card-text-content">${value.Phone}</span></div>
										
									  </div>
									</div>
								
								</div>	`;												
					
				});
			} else {
				alert("axios error");
				return;
			}						
			
			mainCardsEl.innerHTML = str ; 
			 
			//console.log(response.data); // ex.: { user: 'Your User'}
			//console.log(response.status); // ex.: 200
		  });  
	}
	
	//初始化首頁
	//indexInit("hotspot");// 連API要打開
	//indexInit("activity");// 連API要打開
	//indexInit("restaurant");// 連API要打開
	//indexInit("hotel");// 連API要打開
	
}



