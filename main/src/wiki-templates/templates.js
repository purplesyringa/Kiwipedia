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

export default {
	"cite web": CiteWeb,
	"reflist": RefList,
	"ambox": AMBox,
	"unexisting-template": UnexistingTemplate,
	"invalid-template": InvalidTemplate,
	"external media": ExternalMedia,
	"<ref>": Ref,
	"#if": HashIf,
	"if": If,
	"nUMBEROFARTICLES": NumberOfArticles,
	"<math>": MathTag,
	"math": MathBrackets,
	"nowrap": NoWrap,
	"about": About,
	"hatnote": HatNote
};