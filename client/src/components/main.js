import * as view from './view.js';

export default function overall(){
	var main_canvas = document.getElementById('canvas');
	var context = main_canvas.getContext('2d');

	view.setup_canvas(main_canvas);
	var screen_width = main_canvas.width;
	var screen_height = main_canvas.height;


	console.log(main_canvas);
	console.log(screen_width);
	console.log(screen_height);
	
	//this draws the board. but we don't need a board(?) hmm
	//var field_drawer = new view.field_drawer(context, main_canvas);
	//field_drawer.set_radius(screen_height/19.2);
	//field_drawer.draw_field_layout( "#000000");
}