thirdCountryDR(_,TCT,_,_,S,_) :- % 01. optional: no third country transfer, safeguards have been supplied, but not necessary, all correct, just a hint
    \+ TCT,
    []\=S.
    %write("HINT: safeguards not required for non-third countries: "),
    %write(N),write("("),write(P),writeln(")").

thirdCountryDR(N,TCT,_,AD,_,P) :- % 02. no third country transfer, marked as adequate, wrong
    \+ TCT,
    AD,
    write("ERROR: adequacy should be false for non-third country data recipients: "),
    write(N),write("("),write(P),writeln(")").
	
thirdCountryDR(_,TCT,CO,AD,_,_) :- % 03. no third country transfer, no country provided, not marked as adequate, all correct
    \+ TCT,
    CO=="",
    \+ AD.

thirdCountryDR(_,TCT,CO,_,_,_) :- % 04. no third country transfer, country provided, wrong (HINT)
    \+ TCT,
    CO\="".
    %write("HINT: country must not be provided for non-third country data recipients: "),
    %write(N),write("("),write(P),writeln(")").
	
thirdCountryDR(N,TCT,CO,_,_,P) :- % 05. third country transfer, unknown country provided, wrong
    TCT,
    CO\="",
    \+ country(CO),
    write("ERROR: unknown third country provided for: "),
    write(N),write("|"),write(CO),write("("),write(P),writeln(")").

thirdCountryDR(N,TCT,CO,_,_,P) :- % 06. third country transfer, no country provided, wrong
    TCT,
    CO=="",
    write("ERROR: country must be provided for third country data recipient: "),
    write(N),write("("),write(P),writeln(")").

thirdCountryDR(N,TCT,CO,_,_,P) :- % 07. transfer to EU member state, marked as third country transfer, wrong
    TCT,
    eumember(CO),
    write("ERROR: Union state marked as third country: "),
    write(N),write("("),write(P),writeln(")").
	
thirdCountryDR(N,TCT,CO,AD,_,P) :- % 08. third country transfer to adequate country, not marked as adequate, wrong
    TCT,
    adequate(CO),
    \+ AD,
    write("ERROR: third country not marked as falling under adequacy decision: "),
    write(N),write("("),write(P),writeln(")").

thirdCountryDR(_,TCT,CO,_,S,_) :- % 09. optional: third country transfer to adequate country, actually (marked as adequate), safeguards have been supplied, but not necessary, all correct, just a hint
    TCT,
    adequate(CO),
%    AD, not relevant, cf. arrow from (6)
    %(nonvar(S);[]\=S),
    nonvar(S),
    []\=S.
    %write("HINT: safeguards not required for countries under adequacy decision: "),
    %write(N),write("|"),write(CO),write("("),write(P),writeln(")").
	
thirdCountryDR(_,TCT,CO,AD,S,_) :- % 10. third country transfer to adequate country, actually marked as adequate, all correct
    TCT,
    adequate(CO),
    AD,
    (var(S);[]==S).

thirdCountryDR(N,TCT,CO,AD,_,P) :- % 11. third country transfer to non adequate country, marked as adequate, wrong
    TCT,
    \+ adequate(CO),
    \+ eumember(CO),
	country(CO),
    AD,
    write("WRONG: third country misleadingly marked as falling under adequacy decision: "),
    write(N),write("("),write(P),writeln(")").

thirdCountryDR(N,TCT,CO,_,S,P) :- % 11./12. third country transfer to non adequate country, no safeguards provided, wrong
    TCT,
    \+ adequate(CO),
    \+ eumember(CO),
    country(CO),
    (var(S);[]==S),
    write("ERROR: safeguards must be provided for third country DR without adequacy decision: "),
    write(N),write("|"),write(CO),write("("),write(P),writeln(")").

thirdCountryDR(_,TCT,CO,AD,S,_) :- % 13. third country transfer to non adequate country, not marked as adequate, safeguards have been specified, all correct
    TCT,
    \+ adequate(CO),
    country(CO),
    AD==false,
    nonvar(S),
    []\=S.
    %(nonvar(S);[]\=S).

thirdCountryDR(_,TCT,CO,AD,S,_) :- % new: third country transfer to non adequate wildcard (*) country, not marked as adequate, safeguards have been specified, hint for missing country
    TCT,
    \+ adequate(CO),
    country(CO),
    CO == "*",
    AD==false,
    nonvar(S),
    []\=S.
    %write("HINT: third country data recipients should be provided with a specific country: "),
    %write(N),write("("),write(P),writeln(")").
    
