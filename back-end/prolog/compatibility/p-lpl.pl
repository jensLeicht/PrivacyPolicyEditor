% language specific definitions

% lpp/1
% lpp(P) :-
% +P : policy tuple (_,_,_,_,_,_,_,_,P,PH,_,_,_,_,_)
%% P  : list of purposes
%% PH : purpose hierarchy
% ==========
% root element of a layered privacy policy
% ==========
lpp((_,_,_,_,_,_,_,_,P,PH,_,_,_,_,_)) :-
    purposeMapping(P,PE), % check purposes for errors
    (PE\=[],propagatePurposeHierarchy(PH,PE);PE==[]). % propagate errors through hierarchy

% ================================================================


% purposeMapping/2
% purposeMapping(P,EE) :-
% +P : list of purpose ids
% -EE: list of purpose ids containing compatibilty issues
% ==========
% checks a list of purposes
% maps from id to purpose element: purpose(H,P)
% ==========
purposeMapping([H|T],EE) :-
	purpose(H,P),
	purposeCheck(P,E),
	purposeMapping(T,ED),
    (E,EE=[H|ED];\+ E,EE=ED).

purposeMapping([],[]).

% ================================================================

% TODO add E to comment (error flag)
% purposeCheck/2
% purposeCheck(P,E) :-
% +P : purpose tuple (I,O,R,P,H,D,DT,_,_,DR,L,A,_)
%% I  : id, no duplicates allowed in the list of purposes
%% R  : required, bool; if true and no consent is given, the whole policy cannot be consented
%% P  : point of acceptance, date and time when consent was provided
%% DT : list of data, that is processed for this purpose
%% DR : list of data recipients
% -E : TODO
% ==========
% check purpose for compatibility
% ==========
purposeCheck((I,_,R,P,_,_,DT,_,_,DR,_,_,_),E) :-
    data(DT,I,DE),
    dataRecipientMapping(DR,I,DRE),
    % calculate errors and return E, when errors occurred
    (DE,ED=["""purposeDataRequired"""],!;\+ DE,ED=[]),
    (DRE,EDR=["""purposeDataRecipientRequired"""|ED],!;\+ DRE,EDR=ED),
    (P = [],R,EDP=["""purposeRequired"""|EDR],!;(P\=[];\+ R),EDP=EDR),
    (EDP = [],E=false,!;E=true,concatErrors(EDP,ERRORS),write("|""type"":""purpose"",""purposeID"":"""),write(I),write(""",""id"":"""),write(I),write(""",""errorIDs"":["),write(ERRORS),write("]")).

% ================================================================


% data/3
% data(D,P,EE) :-
% +D : list of data ids
% +P : id of the corresponding purpose
% -EE: TODO describe EE
% ==========
% checks a list of data elements including mapping from "id" to datum element: datum(H,D)
% ==========
data([H|T],P,EE) :-
    datum(H,D),
    datumCheck(D,P,E),
    data(T,P,ED),
    EE=(E;ED).

data([],_,false).

% ================================================================


% datumCheck/3
% datumCheck(D,P,E) :-
% +D :  data tuple (I,_,R,PA,_,_,_,_,_,_)
%% I  : id, no duplicates allowed in a policy
%% R  : required (bool), if true and no consent is given, the whole corresponding purpose cannot be consented
%% PA : point of acceptance, date and time when consent was provided
% +P : id of the corresponding purpose
% -E : TODO describe E
% ==========
% check datum for compliance
% ==========
datumCheck((I,_,R,PA,_,_,_,_,_,_),P,E) :-
    % add (print) errors to response
    (PA = [],R,E = true,
	write("|""type"":""data"",""purposeID"":"""),
	write(P),
	write(""",""id"":"""),
	write(I),
	write(""",""errorIDs"":[""dataRequired""]"),!;
	E = false).

% ================================================================


% dataRecipientMapping/3
% dataRecipientMapping(L,P,EE) :-
% +L : list of data recipients
% +P : id of the corresponding purpose
% -EE: TODO describe EE
% ==========
% checks a list of data recipients, including mapping from "id" to dataRecipient element: dataRecipient(H,DR)
% ==========
dataRecipientMapping([H|T],PN,EE) :-
    dataRecipient(H,DR),
    dataRecipientCheck(DR,PN,E),
    dataRecipientMapping(T,PN,ED),
    EE=(E;ED).
    
dataRecipientMapping([],_,false).

% ================================================================


% dataRecipientCheck/3
% dataRecipientCheck(DR,P,E) :-
% +DR: data recipient tuple (I,_,_,_,R,PA,_,_,_,_,_,_)
%% I  : id, unique
%% R  : required (bool), if true and no consent is given, the whole corresponding purpose cannot be consented
%% PA : point of acceptance, date and time when consent was provided
% +P : id of the corresponding purpose
% -E : TODO describe E
% ==========
% checks a data recipient for compliance
% ==========
dataRecipientCheck((I,_,_,_,R,PA,_,_,_,_,_,_),PN,E) :-
    % add (print) errors to response
    (PA = [],R,E = true,
	write("|""type"":""dataRecipient"",""purposeID"":"""),
	write(PN),
	write(""",""id"":"""),
	write(I),
	write(""",""errorIDs"":[""dataRecipientRequired""]"),!;
	E = false).

% ================================================================


% TODO add description for following rules

% propagate purpose errors to purpose categories
propagatePurposeHierarchy(PH,PE) :-
    aggregate_all(count,propagatePH(PH,PE),_).

propagatePH(PH,PE) :-
    purpose(P),
    member((P,SP),PH),
    memberchk(SP,PE),
    write("|""type"":""purposeCategory"",""purposeID"":"""),write(P),write(""",""id"":"""),write(P),write(""",""errorIDs"":[""purposeError""]").