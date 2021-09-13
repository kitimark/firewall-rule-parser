import { FirewallRuleLexer, ExpressionContext, FirewallRuleParser } from '@apollo21/firewall-rule-parser';
import { CharStreams, CommonTokenStream, ParserRuleContext, Token } from 'antlr4ts';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import Tree from 'react-d3-tree';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

import './App.css';

const loop = (parent: ExpressionContext): object => {
  const _result = parent.children?.map(child => {
    const result = loop(child as ExpressionContext);
    return result;
  })

  return {
    children: _result,
    // name: _result ? '' : parent.text ,
    name: parent.text,
  }
}

const convertToTree = (tree: ExpressionContext) => {
  const result = tree.children?.map(child => {
    return loop(child as ExpressionContext);
  })
  return {
    name: tree.text,
    children: result,
  }
}

const _flat = (current: ParserRuleContext): ParserRuleContext => {
  // base case: leaf node
  if (!current.children) {
    return current;
  }

  // remove chain node
  if (current.children.length === 1) {
    return _flat(current.children[0] as ParserRuleContext);
  }

  // remove parent expression node
  if (current.children.length === 3 && (current.children[0] as TerminalNode).symbol?.type === FirewallRuleParser.LPARENT) {
    return _flat(current.children[1] as ParserRuleContext);
  }

  // traverse each children node
  const _children = current.children.map(child => {
    const _child = child as ParserRuleContext;
    return _flat(_child);
  })
  current.children = _children;
  return current;
}

const flatTree = (tree: ExpressionContext) => {
  const _tree = _flat(tree);
  return _tree as ExpressionContext;
}

function App() {
  // const string = `(not http.cookie contains "test" and http.cookie eq "test=test") or (ip.geoip.continent eq "AN")`;

  // const string = `(not http.cookie contains "test")`

  // const string = `(ssl and ip.geoip.continent eq "" and ip.geoip.continent eq "") or (http.cookie eq "" and ip.geoip.country eq "") or (http.cookie eq "")`
  // const string = `(ip.geoip.country eq "TH")`
  const string = `(geoip.country in { "TH" })`

  const inputStream = CharStreams.fromString(string);

  const lexer = new FirewallRuleLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new FirewallRuleParser(tokenStream);
  let tree = parser.expression();
  console.log(tree);
  tree = flatTree(tree);

  console.log(tree);
  console.log(convertToTree(tree));

  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Tree 
        data={convertToTree(tree) as RawNodeDatum} 
        orientation="vertical"
      />
    </div>
  );
}

export default App;
