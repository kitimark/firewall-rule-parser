import { CharStreams, CommonTokenStream } from 'antlr4ts'
import { FirewallRuleLexer, FirewallRuleParser } from '..'

const string = `(ip.geoip.country in {"TH" "US"}) or ip.geoip.asnum eq 1 and http.cookie eq "test=test"`;

const inputStream = CharStreams.fromString(string);

const lexer = new FirewallRuleLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);

const parser = new FirewallRuleParser(tokenStream);
const tree = parser.expression();

console.log(tree);