% checks

% dsrComplianceCheck(D,C,P) :-
% +D : list of DSR ids
% +C : list of controller ids
% +P : list of purposes
% ==========
% checks whether all necessary data subject rights are provided
% ==========
dsrComplianceCheck(D,C,_) :-
    \+ publicAuthorityCheck(C),
    \+ memberchk((portability,_,_),D),
    writeln("Data Subject Right: ""portability"" missing.").

dsrComplianceCheck(D,_,P) :-
    admCheck(P,R),
    length(R,L),
    L > 0,
    \+ memberchk((intervention,_,_),D),
    write("Data Subject Right: ""intervention"" required due to automated decision-making in purposes: "),writeln(R).

dsrComplianceCheck(D,_,_) :-
    dsr(R),
    R \= portability,
    R \= intervention,
    \+ memberchk((R,_,_),D),
    write("Data Subject Right: """),write(R),writeln(""" missing.").

% ================================================================


% admCheck(P,O) :-
% +P : list of purposes
% -O : list of purposes with automated decision-making
% ==========
% generates a list of purposes that contain automated decision-making
% used in dsrCheck
% ==========
admCheck([H|T],[P|R]) :-
    purpose(H,PD),
    automatedDecisionMaking(PD,P),
    admCheck(T,R).

admCheck([H|T],R) :-
    purpose(H,PD),
    \+ automatedDecisionMaking(PD,_),
    admCheck(T,R).

admCheck([],[]).

% ================================================================


% automatedDecisionMaking(P,I) :-
% +P : purpose tuple
% -I : purpose id, when the purpose specifies automated decision-making
% ==========
% checks whether a purpose specifies automated decision-making
% ==========
automatedDecisionMaking((I,_,_,_,_,_,_,_,_,_,_,A,_),I) :-
    A \= [].

% ================================================================


% anonymizationLevels(A,D,P) :-
% +A : list of anonymization method attributes
% +D : id of corresponding data element
% +P : id of corresponding purpose element
% ==========
% checks that minimum and maximum anonymization levels are supplied
% for a given anonymization method
% ==========
anonymizationLevels(A,D,P) :-
   memberchk(("Minimum Level",MI),A),
   memberchk(("Maximum Level",MA),A),
   number_codes(MIL, MI),
   number_codes(MAL, MA),
   integer(MIL),
   integer(MAL),!;
   write("Minimum and maximum anonymization levels must be supplied:"),write(D),write("-"),write(P),nl.

% ================================================================


% legalObligationCheck(LO,R,P) :-
% +LO : legal obligation flag
% +R : required flag
% +P : id of corresponding purpose element
% ==========
% legal obligation checks
% ==========
legalObligationCheck(LO,R,P) :- % purpose marked as legal obligation, but not as required
    LO,
    \+ R,
    write("ERROR: legal obligation must be marked as required:"),
    writeln(P),!.

legalObligationCheck(LO,R,_) :- % correct, legal obligation and required
    LO,
    R,!.

legalObligationCheck(LO,_,_) :- % correct, no legal obligation
    \+ LO.

% ================================================================


% mapDataNames(D,N) :-
% +D : list of data element ids
% -N : list of names of the provided data list
% ==========
% data mapping for data name checking
% ==========
mapDataNames([HD|TD],[HN|TN]) :-
    datum(HD,D),          % map data element
    D=(HN,_,_,_,_,_,_,_,_), % extract name of mapped data element
    mapDataNames(TD,TN).
mapDataNames([],[]).

% ================================================================


% mapPurposeNames(P,N) :-
% +P : list of purpose element ids
% -N : list of names of the provided purpose list
% ==========
% purpose mapping for purpose name checking
% ==========
mapPurposeNames([HP|TP],[HN|TN]) :-
    (purpose(HP,P),!; \+ purpose(HP,_), write("purpose not found: "), writeln(HP), fail),
    P=(HN,_,_,_,_,_,_,_,_,_,_,_),
    mapPurposeNames(TP,TN).
mapPurposeNames([],[]).

% ================================================================


% dataNamesPSM(N,D,PS,P) :-
% +N : list of data names specified for a pseudonymization method
% +D : list of names of the corresponding purpose
% +PS: id of the corresponding pseudonymization method
% +P : id of the corresponding purpose
% ==========
% check data names in a pseudonymization method
% ==========
dataNamesPSM([H|T],DT,PS,P) :-
    (memberchk(H,DT),!;
    write("incorrect data name provided in pseudonymization method:"),
	write(PS),
	write("("),
	write(P),
	writeln(")")),
    dataNamesPSM(T,DT,PS,P).
	
dataNamesPSM([],_,_,_).

% ================================================================


% dataNamesPM(N,D,PS,P) :-
% +N : list of data names specified for a privacy model
% +D : list of names of the corresponding purpose
% +PS: id of the corresponding privacy model
% +P : id of the corresponding purpose
% ==========
% check data names in a privacy model
% ==========
dataNamesPM([H|T],DT,PS,P) :-
    (memberchk(H,DT),!;
    write("incorrect data name provided in privacy model:"),
	write(PS),
	write("("),
	write(P),
	writeln(")")),
    dataNamesPM(T,DT,PS,P).
	
dataNamesPM([],_,_,_).

% ================================================================


% getDupes(S,D) :-
% +S : list of atoms
% -D : list of duplicate elements
% ==========
% check whether a list contains duplicate elements
% ==========
getDupes(S,D) :-
    aggregate_all(set(X),dupes(S,X),D).

dupes(S,X) :-
    select(X,S,R), member(X,R).

% ================================================================


% dpoCheck(D,C) :-
% +D : list of DPOs
% +C : list of DCs
% ==========
% check if DPOs are correctly provided, else provide hint for missing DPO
% ==========
dpoComplianceCheck([],C) :-
    publicAuthorityCheck(C),
    writeln("A dedicated DPO is required for public authorities."),
    !.

dpoComplianceCheck([],_) :-
    writeln("A dedicated DPO may be required. Consult Art. 37 Para. 1 GDPR for further details."),
    !.

% ================================================================


% publicAuthorityCheck(C) :-
% +C : list of DCs
% ==========
% check whether the DC is a public authority
% ==========
publicAuthorityCheck([H|_]) :- controller(H,(_,"Public Authority",_,_,_,_,_,_,_,_,_)),!.
publicAuthorityCheck([_|T]) :- publicAuthorityCheck(T).
publicAuthorityCheck([]) :- false.

% ================================================================


% getLegalObligation(L,O) :-
% +L : list of legal bases ids
% -O : bool, whether legal obligation is present
% ==========
% check whether a legal obligation is provided
% ==========
getLegalObligation(L,O) :-
    (memberchk(legalObligation,L) -> O = true;
    O = false).

% ================================================================


% purposeDuplicateCheck/1
% purposeDuplicateCheck(P) :-
% +P : list of purposes
% ==========
% check for duplicate purpose elements
% ==========
purposeDuplicateCheck(P) :-
    mapPurposeNames(P,PN), % retrieve names
    getDupes(PN,D),        % identify duplicates
    length(D,L),           % check duplicate results
    (L > 0 ->              % respond
	write("duplicate purpose element: "),write(D),nl;
    L == 0).               % all fine, nothing to do

% ================================================================


% dataRecipientDuplicateCheck/2
% dataRecipientDuplicateCheck(D,P) :-
% +D : list of DR ids
% +P : id of corresponding purpose
% ==========
% check for duplicate data recipient elements
% ==========
dataRecipientDuplicateCheck(D,P) :-
    getDupes(D,DP), % identify duplicates
    length(DP,L),   % check duplicate results
    (L > 0 ->       % respond
	    write("found duplicate data recipient elements """),
	    write(DP),
	    write(""" in purpose: "),
		writeln(P);
    L == 0).        % all fine, nothing to do