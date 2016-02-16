var navmenu = {
	init: function(){
		this.cacheDom();
		this.bindEvents();
	},
	cacheDom: function(){
		this.menuButton = document.getElementById("menu-button");
		this.menuOptions = document.getElementById("menu-options");
		this.menuOptionBack = document.getElementById("menu-option-back");
		this.navMain = document.getElementById("main");
	},
	bindEvents: function(){
		this.menuButton.addEventListener("click", this.toggleMenuVisibility.bind(this));
		this.menuOptionBack.addEventListener("click", this.toggleMenuVisibility.bind(this));
	},
	toggleMenuVisibility: function(){
		if(this.menuOptions.classList.contains("visible")){
			this.menuOptions.classList.remove("visible");
			this.menuOptionBack.classList.remove("visible");
		}
		else{
			this.menuOptions.classList.add("visible");
			this.menuOptionBack.classList.add("visible");
		}
	}
};
navmenu.init();