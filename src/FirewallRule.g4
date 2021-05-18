/**
 *
 * Firewall rule language (Cloudflare)
 *
 * This implementation cover a firewall rule that generated 
 * by firewall rule gui only. not cover all of this reference languege 
 * and not validate value of field.
 *  
 * @ref https://developers.cloudflare.com/firewall/cf-firewall-language#:~:text=The%20Firewall%20Rules%20language%20includes,that%20should%20be%20evaluated%20together. 
 * @author Wasutan Kitijerapat (wasutan.kiti@gmail.com)
 *
 */
grammar FirewallRule;

expression: orExpression;
 
orExpression 
  : orExpression OR xorExpression
  | xorExpression;

xorExpression
  : xorExpression XOR andExpression
  | andExpression;

andExpression
  : andExpression AND factorExpression
  | factorExpression;

factorExpression
  : LPARENT expression RPARENT
  | NOT comparisonExpression
  | comparisonExpression;

comparisonExpression
  : FIELD comparisonOperator values
  | FIELD;

comparisonOperator: (EQ | NE | LT | LE | GE | CONTAINS | MATCHES | IN);

values: array | value;

array: LBRANCE value* RBRANCE;

value: STR | NUM;

LBRANCE: '{';
RBRANCE: '}';

LPARENT: '(';
RPARENT: ')';

// logical operator
NOT: 'not';
AND: 'and';
XOR: 'xor';
OR: 'or';

// comparison operators
EQ: 'eq';
NE: 'ne';
LT: 'lt';
LE: 'le';
GT: 'gt';
GE: 'ge';
CONTAINS: 'contains';
MATCHES: 'matches';
IN: 'in';

STR: '"' CHAR* '"';
NUM: [1-9][0-9]*;

fragment CHAR: ~["\\\r\n];

// field
FIELD: [a-z][a-z._]*[a-z];

WS: [ \n\r\t] -> channel(HIDDEN);
