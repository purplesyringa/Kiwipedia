import CiteWeb from "./cite-web.js";
import RefList from "./reflist.js";
import AMBox from "./ambox.js";
import UnexistingTemplate from "./unexisting-template.js";
import InvalidTemplate from "./invalid-template.js";
import ExternalMedia from "./external-media.js";
import Ref from "./ref.js";
import HashIf from "./#if.js";
import If from "./if.js";
import NumberOfArticles from "./numberofarticles.js";
import MathTag from "./mathtag.js";
import MathBrackets from "./math.js";
import NoWrap from "./nowrap.js";
import About from "./about.js";
import HatNote from "./hatnote.js";
import Main from "./main.js";
import MVar from "./mvar.js";
import SeeAlso from "./see-also.js";

let Templates = {};

for(let template of [
	CiteWeb,
	RefList,
	AMBox,
	UnexistingTemplate,
	InvalidTemplate,
	ExternalMedia,
	Ref,
	HashIf,
	If,
	NumberOfArticles,
	MathTag,
	MathBrackets,
	NoWrap,
	About,
	HatNote,
	Main,
	MVar,
	SeeAlso
]) {
	Templates[template.name] = template;
}

export default Templates;