




	var qrcode = new QRCode(document.getElementById("qrcode"), {
        
        width : 250,
        height : 250,

        
       
        
	
    });
    
  

	function makeCode () {		
        var elText = document.getElementById("text");

 
        qrcode.makeCode(elText.value);
        

    }
    
    	$("#text").
		on("blur", function () {
			makeCode();
		}).
		on("keydown", function (e) {
			if (e.keyCode == 13) {
				makeCode();
			}
		});

	
    makeCode()

	



    $(document).ready(function () {
        $("#text").change(function() {
            if (!/:\/\//.test(this.value)) {
                this.value = "http://" + this.value;
                makeCode () 
            }
            
        });
    });




