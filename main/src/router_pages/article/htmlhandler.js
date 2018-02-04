import {ElementType} from "./htmlparser.js";

export default class Handler {
	constructor() {
		this.reset();
		this._options = {};

		if(this._options.enforceEmptyTags == undefined) {
			//Don't allow children for HTML tags defined as empty in spec
			this._options.enforceEmptyTags = true;
		}
	}

	// HTML Tags that shouldn't contain child nodes
	static _emptyTags = {
		area: 1,
		base: 1,
		basefont: 1,
		br: 1,
		col: 1,
		frame: 1,
		hr: 1,
		img: 1,
		input: 1,
		isindex: 1,
		link: 1,
		meta: 1,
		param: 1,
		embed: 1
	};

	// Regex to detect whitespace only text nodes
	static reWhitespace = /^\s*$/;

	// Resets the handler back to starting state
	reset() {
		this.dom = [];
		this._done = false;
		this._tagStack = [];
		this._tagStack.last = function() {
			return this.length ? this[this.length - 1] : null;
		};
	}

	// Signals the handler that parsing is done
	done() {
		this._done = true;
	}
	writeTag(element) {
		this.handleElement(element);
	} 
	writeText(element) {
		this.handleElement(element);
	}
	writeComment(element) {
		this.handleElement(element);
	} 
	writeDirective(element) {
		this.handleElement(element);
	}

	// Handler options for how to behave
	_options = null;

	// Flag indicating whether handler has been notified of parsing completed
	_done = false;

	// List of parents to the currently element being processed
	_tagStack = null;

	isEmptyTag(element) {
		let name = element.name.toLowerCase();
		if(name.charAt(0) == '/') {
			name = name.substring(1);
		}
		return this._options.enforceEmptyTags && !!Handler._emptyTags[name];
	}

	handleElement(element) {
		if(this._done) {
			throw new Error("Writing to the handler after done() called is not allowed without a reset()");
		}

		if(!this._tagStack.last()) {
			// There are no parent elements

			// If the element can be a container, add it to the tag stack and the top level list
			if(element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				// Ignore closing tags that obviously don't have an opening tag
				if(element.name.charAt(0) != "/") {
					this.dom.push(element);
					// Don't add tags to the tag stack that can't have children
					if(!this.isEmptyTag(element)) {
						this._tagStack.push(element);
					}
				}
			} else {
				// Otherwise just add to the top level list
				this.dom.push(element);
			}
		} else {
			// There are parent elements

			// If the element can be a container, add it as a child of the element
			// on top of the tag stack and then add it to the tag stack
			if(element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				if(element.name.charAt(0) == "/") {
					// This is a closing tag, scan the tagStack to find the matching opening tag
					// and pop the stack up to the opening tag's parent
					let baseName = element.name.substring(1);
					if(!this.isEmptyTag(element)) {
						let pos = this._tagStack.length - 1;
						while(pos > -1 && this._tagStack[pos--].name != baseName);
						if(pos > -1 || this._tagStack[0].name == baseName) {
							while(pos < this._tagStack.length - 1) {
								this._tagStack.pop();
							}
						}
					}
				} else {
					// This is not a closing tag
					if(!this._tagStack.last().children) {
						this._tagStack.last().children = [];
					}
					this._tagStack.last().children.push(element);

					//Don't add tags to the tag stack that can't have children
					if(!this.isEmptyTag(element)) {
						this._tagStack.push(element);
					}
				}
			} else {
				//This is not a container element
				if(!this._tagStack.last().children) {
					this._tagStack.last().children = [];
				}
				this._tagStack.last().children.push(element);
			}
		}
	}
};