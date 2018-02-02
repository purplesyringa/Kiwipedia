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
import Math_ from "./math.js";

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
	"<math>": Math_
};