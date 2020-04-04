


	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 1000,
		height : 1000,
	
	});
    
  

	function makeCode () {		
        var elText = document.getElementById("text");
   

        var tb = document.getElementById("scriptBox");
        eval(tb.value);
        qrcode.makeCode(elText.value);
 

        var tb = document.getElementById("scriptBox");
        eval(tb.value);
        qrcode.makeCode(elText.value);
        return runScript;
	}
	
	makeCode();
	
	$("#text").
		on("blur", function () {
			makeCode();
		}).
		on("keydown", function (e) {
			if (e.keyCode == 13) {
				makeCode();
			}
		});



function runScript(e) {

    if (e.keyCode == 13) {
        var tb = document.getElementById("scriptBox");
        eval(tb.value);
        return false;
    }
}
