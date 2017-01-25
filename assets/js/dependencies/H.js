var H = H || {}
	H.Template = {},
	t = {};


for(var j in JST){
	var n = j.replace('assets/templates/', '').replace('.html', '');
	H.Template[n] = t[n] = JST[j];
}
