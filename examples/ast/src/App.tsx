import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FirewallRuleLexer, ExpressionContext, FirewallRuleParser } from '@apollo21/firewall-rule-parser';
import { CharStreams, CommonTokenStream } from 'antlr4ts';

function App() {
  const string = `(ip.geoip.country in {"TH" "US"}) or (ip.geoip.asnum eq 1 and http.cookie eq "test=test")`;

  const inputStream = CharStreams.fromString(string);

  const lexer = new FirewallRuleLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);

  const parser = new FirewallRuleParser(tokenStream);
  const tree = parser.expression();

  console.log(tree);

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
