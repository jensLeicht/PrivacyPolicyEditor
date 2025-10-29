% language specific definitions

% lpp/1
% lpp(P) :-
% +P : policy tuple (V,N,L,PU,H,D,I,DSI,P,PH,C,DPO,DSR,LC,UPP)
%% V  : version
%% N  : internal name of the policy
%% L  : language
%% PU : URI to textual privacy policy
%% H  : headers of the policy in different languages
%% D  : descriptions of the policy in different languages
%% I  : (unused in PriPoCoG) specific icons used in the policy
%% DSI: (unused in PriPoCoG) id of data source
%% P  : list of purposes
%% PH : purpose hierarchy
%% C  : list of data controllers (DCs)
%% DPO: list of data protection officers (DPOs)
%% DSR: list of data subject rights (DSRs)
%% LC : responsible supervisory data protection authority (DPA) [lodge complaint in LPL]
%% UPP: underlying P-LPL policy
% ==========
% root element of a layered privacy policy
% ==========
lpp((V,N,L,PU,H,D,I,DSI,P,PH,C,DPO,DSR,LC,UPP)) :-
	write("Results for policy """),
	write(N),
	writeln(""":"),
    number(V),
    string(N),
    lang(L),
    string(PU),
    hdTuples(H,"HEAD of policy"),
    hdTuples(D,"DESC of policy"),
    nTriples(I,"Icons"),
    dataSourceMapping(DSI),
    purposeDuplicateCheck(P),                            % check for duplicate entries in purpose list
	purposeMapping(P),
    purposeHierarchy(PH),
    purposeHierarchyChecks(PH,P),                        % perform consistency checks on the hierarchy
    controllerMapping(C,0),
    dpoMapping(DPO),
    aggregate_all(count,dpoComplianceCheck(DPO,C),_),    % check whether a DPO is required and provided
    dsrMapping(DSR,DSRL),
    aggregate_all(count,dsrComplianceCheck(DSRL,C,P),_), % check whether all required DSRs are provided
    supervisoryAuthority(LC),
	writeln("end of policy"),
    uppMapping(UPP).

% ================================================================


% uppMapping/1
% uppMapping(U) :-
% +U : id of underlying policy
% ==========
% checks the underlying policy
% maps from id to lpp element: lpp(U,P)
% ==========
uppMapping(U) :-
	lpp(U,P),
	upp(P).

% ================================================================


% upp/1
% upp(P) :-
% +P : P-LPL policy
% ==========
% checks the sub-policy for compliance
% ==========
upp([]):- !. % empty underlying policies

upp(P) :-
	writeln("Beginning of sub-policy:"),
	lpp(P).

% ================================================================


% entity/1
% entity(E) :-
% +E : entity tuple (I,C,A,T,H,D)
%% I : id, unique
%% C : classification in {"Person", "Legal Entity", "Public Authority"}
%% A : (unused in PriPoCoG) authInfo
%% T : type in {"Data Source", "Data Recipient", "Data Controller", "Data Protection Officer", "Data Protection Authority"}
%% H : headers of the entity in different languages
%% D : descriptions of the entity in different languages
% ==========
% a basic entity
% used to define DataSources, DataRecipients,
% DataControllers, and DataProtectionOfficers
% ==========
entity((I,C,A,T,H,D)) :-
    string(I),
    classification(C),
    string(A),
    entityType(T),
    string_concat("HEAD of Entity ",I,MH),
    hdTuples(H,MH),
    string_concat("DESC of Entity ",I,MD),
    hdTuples(D,MD).

% ================================================================


% dataSourceMapping/1
% dataSourceMapping(DSI) :-
% +DSI : data source id
% ==========
% checks the data source
% maps from id to data source element: dataSource(DSI,DS)
% ==========
dataSourceMapping(DSI) :-
	dataSource(DSI,DS),
	dataSourceCheck(DS).

% ================================================================


% dataSourceCheck/1
% dataSourceCheck(D) :- (unused in PriPoCoG)
% +D : entity tuple (I,C,A,T,P,H,D)
%% I : id, unique
%% C : classification in {"Person", "Legal Entity", "Public Authority"}
%% A : (unused in PriPoCoG) authInfo
%% T : type = "DataSource"
%% P : publicly available, bool, states whether the data was retrieved directly from the data subject or was publicly available
%% H : headers of the entity in different languages
%% D : descriptions of the entity in different languages
% ==========
% checks the data source (unused in PriPoCoG)
% ==========
dataSourceCheck((I,C,A,T,P,H,D)) :-
    entity((I,C,A,T,H,D)),
    boolean(P),
    T="Data Source".

dataSourceCheck([]). % empty for non-instantiated policies

% ================================================================


% purposeMapping/1
% purposeMapping(P) :-
% +P : list of purpose ids
% ==========
% checks a list of purposes
% maps from id to purpose element: purpose(H,P)
% ==========
purposeMapping([H|T]) :-
	purpose(H,P),
	purposeCheck(P),
	purposeMapping(T).

purposeMapping([]).

% ================================================================


% purposeCheck/1
% purposeCheck(P) :-
% +P : purpose tuple (I,O,R,P,H,D,DT,PM,PSM,DR,L,A,RT)
%% I  : id, no duplicates allowed in the list of purposes
%% O  : opt-out, bool, optOut=true, optIn=false
%% R  : required, bool; if true and no consent is given, the whole policy cannot be consented
%% P  : point of acceptance, date and time when consent was provided
%% H  : headers of the purpose in different languages
%% D  : descriptions of the purpose in different languages
%% DT : list of data, that is processed for this purpose
%% PM : (optional) privacy models
%% PSM: (optional) pseudonymization methods
%% DR : list of data recipients
%% L  : list of legal bases
%% A  : list of automated decision-making
%% RT : id of the retention of the data for this purpose
% ==========
% check purpose for compliance
% ==========
purposeCheck((I,O,R,P,H,D,DT,PM,PSM,DR,L,A,RT)) :-
    string(I),
    boolean(O),
    boolean(R),
    getLegalObligation(L,LO),          % check whether a legal obligation is provided as legal basis
    legalObligationCheck(LO,R,I),           % legal obligation required check
    pointOfAcceptance(P),
    string_concat("HEAD of purpose ",I,MH),
    hdTuples(H,MH),
    string_concat("DESC of purpose ",I,MD),
    hdTuples(D,MD),
    dataCheck(DT,I),                   % check whether duplicate data elements exist
    dataMapping(DT,I),
    privacyModelMapping(PM,DT,I),
    pseudonymizationMethodMapping(PSM,DT,I),
    dataRecipientDuplicateCheck(DR,I), % check for duplicate data recipients
    dataRecipientMapping(DR,I),
    legalBasisMapping(L,I),
    automatedDecisionMakingMapping(A,I),
    retentionMapping(RT,I).

% ================================================================


% purposeHierarchyChecks/2
% purposeHierarchyChecks(H,P) :-
% +H : purpose hierarchy
% +P : list of purpose ids
% ==========
% purpose hierarchy checks for list of purposes
% ==========
purposeHierarchyChecks(H,P) :-
    singleParentCheck(H),
	atLeastTwoChildrenCheck(H),
    givenPurposeCheck(H,P,[]).

% ================================================================


% singleParentCheck/1
% singleParentCheck(H) :-
% +H : purpose hierarchy
% ==========
% checks whether purposes in the hierarchy have a single parent
% ==========
singleParentCheck([(_,P)|T]) :- % good, no second parent found
    \+ memberchk((_,P),T),!,
    singleParentCheck(T).

singleParentCheck([(_,P)|T]) :- % bad, second parent found
    memberchk((_,P),T),!,
    subtract(T,[(_,P)],R),
    write("purpose """),
	write(P),
	writeln(""" has multiple parent purposes, \c
        should have exactly one"),
    singleParentCheck(R),fail.

singleParentCheck([]).

% ================================================================


% atLeastTwoChildrenCheck/1
% atLeastTwoChildrenCheck(H) :-
% +H : purpose hierarchy
% ==========
% checks whether purposes in the hierarchy have either zero or at least two sub-purposes
% ==========
atLeastTwoChildrenCheck([(P,_)|T]) :- % good, looking at a given purpose
    purpose(P),!,
    atLeastTwoChildrenCheck(T).

atLeastTwoChildrenCheck([(P,_)|T]) :- % good, number of sub-purposes > 1
	\+ purpose(P),
	aggregate_all(bag((P,X)),memberchk((P,X),T),SP),
	length(SP,L),
	L > 0,!,
	subtract(T,SP,R),
    atLeastTwoChildrenCheck(R).

atLeastTwoChildrenCheck([(P,_)|T]) :- % bad, number of sub-purposes = 1
    \+ purpose(P),
	aggregate_all(count,memberchk((P,_),T),L),
	L == 0,!,
    write("purpose """),
	write(P),
	writeln(""" has only one sub-purpose"),
    atLeastTwoChildrenCheck(T).

atLeastTwoChildrenCheck([]).

% ================================================================


% givenPurposeCheck/3
% givenPurposeCheck(H,P,V) :-
% +H : purpose hierarchy
% +P : list of purpose ids
% +V : [] - list of already visited purposes
% ==========
% checks that all purposes have a given purpose as ancestor in the hierarchy
% ==========
givenPurposeCheck(H,[P|T],V) :-
    givenPurposeCheck(H,P,D,V,[]), % called for every purpose in the list of purpose ids
    subtract(T,D,R),               % remove all purposes on the current path to a given purpose from the list of purpose ids
    givenPurposeCheck(H,R,D),!.    % recursion for remainder of the list of purpose ids
	
givenPurposeCheck(_,[],_).

% ================================================================


% givenPurposeCheck/5
% givenPurposeCheck(H,S,R,V,L) :-
% +H : purpose hierarchy
% +S : purpose id (sub-purpose), to be checked
% -R : super-purposes of the current purpose
% +V : purposes that already have a path to a given purpose
% +L : loop detection, list of purposes already visited during check of current purpose
% ==========
% given purpose check for a single purpose
% ==========
givenPurposeCheck(H,S,R,V,L) :-     % purpose has a super-purpose
    memberchk((P,S),H),!,           % retrieve super-purpose of the current purpose
    superPurpose(H,P,S,R,V,L).      % perform super-purpose checks on the current pair of sub- and super-purpose
	
givenPurposeCheck(_,P,[P|V],V,_) :- % purpose does not have a super-purpose
    write("purpose """),
	write(P),
	writeln(""" does not have a super purpose in the hierarchy").

% ================================================================


% superPurpose/6
% superPurpose(H,P,S,R,V,L) :-
% +H : purpose hierarchy
% +P : purpose id (super-purpose), to be checked
% +S : purpose id (sub-purpose), to be checked
% -R : super-purposes of the current purpose
% +V : purposes that already have a path to a given purpose
% +L : loop detection, list of purposes already visited during check of current purpose
% ==========
% checks for given purpose and calls sub-purpose checks on the current pair of purposes
% ==========
superPurpose(_,P,S,[P|L],V,L) :-       % good
    memberchk(P,V),!,                  % super-purpose already visited in previous check
    subPurpose(P,S).                   % perform sub-purpose checks
	
superPurpose(_,P,_,[],_,L) :-         % bad
    memberchk(P,L),!,				   % super-purpose already visited in current check => loop detected
    write("a loop in the purpose hierarchy around purpose: "),
	write(P),
	writeln(" was detected").
	
superPurpose(_,P,S,[S|V],V,_) :-       % good
    purpose(P),!.                      % super-purpose is a given purpose => no further checks
	
superPurpose(H,P,S,[S|R],V,L) :-      % good
    \+ purpose(P),                     % super-purpose is not a given purpose
    subPurpose(P,S),                   % perform sub-purpose checks
    givenPurposeCheck(H,P,R,V,[S|L]). % recursion back to givenPurposeCheck/5 => climb up the hierarchy

% ================================================================


% subPurpose/2
% subPurpose(P,S) :-
% +P : purpose id (super-purpose), to be checked
% +S : purpose id (sub-purpose), to be checked
% ==========
% performs diverse sub-purpose checks on a pair of purposes
% ==========
subPurpose(P,S) :-
    purpose(S,(SN,SO,SR,_,_,_,SDT,SPM,SPSM,SDR,SL,SA,_)), % retrieve necessary information from sub-purpose
    purpose(P,(PN,O,R,_,_,_,DT,PM,PSM,DR,L,A,_)),       % retrieve necessary information from super-purpose
    subPurposeOptOut(SN,PN,SO,O),
    subPurposeRequired(SN,PN,SR,R),
    subPurposeData(SN,PN,SDT,DT),
	subPurposePrivacyModels(SN,PN,SPM,PM),
	subPurposePseudonymizationMethods(SN,PN,SPSM,PSM),
    subPurposeDR(SN,PN,SDR,DR),
    subPurposeLB(SN,PN,SL,L),
    subPurposeADM(SN,PN,SA,A).
%TODO compare retention

% ================================================================


% subPurposeOptOut/4
% subPurposeOptOut(S,P,SO,O) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SO: bool, opt-out value of sub-purpose
% +O : bool, opt-out value of super-purpose
% ==========
% checks that both purposes have the same opt-out value
% ==========
subPurposeOptOut(_,_,O,O) :- !. % good, same value

subPurposeOptOut(S,P,SO,O) :-   % bad, different values
    write("optOut:"),
	write(SO),
	write(" of purpose """),
	write(S),
	write(""" does not match optOut:"),
	write(O),
	write(" of super purpose """),
	write(P),
	writeln("""").
	
% ================================================================


% subPurposeRequired/4
% subPurposeRequired(S,P,SR,R) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SR: bool, required value of sub-purpose
% +R : bool, required value of super-purpose
% ==========
% checks that both purposes have the same required value
% ==========
subPurposeRequired(_,_,R,R) :- !. % good, same value

subPurposeRequired(_,_,SR,R) :- % good, SR < R
    R = true,
    SR = false,!.

subPurposeRequired(S,P,SR,R) :-   % bad, different values
    R = false,
    SR = true,
	write("purpose """),
	write(P),
	write(""" must be marked as required, because child purpose """),
	write(S),
	writeln(""" is marked as required").

% ================================================================


% subPurposeData/4
% subPurposeData(S,P,SD,D) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SD: list of data ids of sub-purpose
% +D : list of data ids of super-purpose
% ==========
% checks that data of the sub-purpose are a subset of data of the super-purpose
% ==========
subPurposeData(_,_,SD,D) :- % good, subset
    subset(SD,D),!.
	
subPurposeData(S,P,SD,D) :- % bad, not a subset
    write("data:"),
	write(SD),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to data:"),
	write(D),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subPurposePrivacyModels/4
% subPurposePrivacyModels(S,P,SPM,PM) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SPM: list of privacy model ids of sub-purpose
% +PM : list of privacy model ids of super-purpose
% ==========
% checks that privacy models of the sub-purpose are a subset of the privacy models of the super-purpose
% ==========
subPurposePrivacyModels(_,_,SPM,PM) :- % good, subset
    subset(SPM,PM),!.
	
subPurposePrivacyModels(S,P,SPM,PM) :- % bad, not a subset
    write("Privacy Models:"),
	write(SPM),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to the privacy models:"),
	write(PM),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subPurposePseudonymizationMethods/4
% subPurposePseudonymizationMethods(S,P,SPSM,PSM) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SPSM: list of pseudonymization method ids of sub-purpose
% +PSM : list of pseudonymization method ids of super-purpose
% ==========
% checks that pseudonymization methods of the sub-purpose are a subset of the pseudonymization methods of the super-purpose
% ==========
subPurposePseudonymizationMethods(_,_,SPSM,PSM) :- % good, subset
    subset(SPSM,PSM),!.
	
subPurposePseudonymizationMethods(S,P,SPSM,PSM) :- % bad, not a subset
    write("Privacy Models:"),
	write(SPSM),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to the privacy models:"),
	write(PSM),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subPurposeDR/4
% subPurposeDR(S,P,SR,R) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SR: list of data recipient ids of sub-purpose
% +R : list of data recipient ids of super-purpose
% ==========
% checks that the data recipients of the sub-purpose are a subset of the data recipients of the super-purpose
% ==========
subPurposeDR(_,_,SR,R) :- % good, subset
    subset(SR,R),!.
	
subPurposeDR(S,P,SR,R) :- % bad, not a subset
    write("dataRecipients:"),
	write(SR),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to dataRecipients:"),
	write(R),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subPurposeLB/4
% subPurposeLB(S,P,SL,L) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SL: list of legal bases of sub-purpose
% +L : list of legal bases of super-purpose
% ==========
% checks that the legal bases of the sub-purpose are a subset of the legal bases of the super-purpose
% ==========
subPurposeLB(_,_,SL,L) :- % good, subset
    subsetLB(SL,L),!.
	
subPurposeLB(S,P,SL,L) :- % bad, not a subset
    write("legalBases:"),
	write(SL),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to legalBases:"),
	write(L),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subPurposeADM/4
% subPurposeADM(S,P,SA,A) :-
% +S : purpose id (sub-purpose), to be checked
% +P : purpose id (super-purpose), to be checked
% +SA: list of automated decision making of sub-purpose
% +A : list of automated decision making of super-purpose
% ==========
% checks that the automated decision making of the sub-purpose are a subset of the automated decision making of the super-purpose
% ==========
subPurposeADM(_,_,SA,A) :- % good, subset
    subsetADM(SA,A),!.
	
subPurposeADM(S,P,SA,A) :- % bad, not a subset
    write("ADM:"),
	write(SA),
	write(" of purpose """),
	write(S),
	write(""" is not a subset or equal to ADM:"),
	write(A),
	write(" of super purpose """),
	write(P),
	writeln("""").

% ================================================================


% subsetLB/2
% subsetLB(SL,L) :-
% +SL: subset of legal bases
% +L : list of legal bases
% ==========
% checks subset property of two sets of legal bases
% ==========
subsetLB([LB|R],L) :-
    legalBasis(LB,(I,_,_)), % retrieve ID of legal basis LB
    subsetLBR(I,L),         % check that name exists in L
	subsetLB(R,L).          % recursion, check rest of subset
	
subsetLB([],_).

% ================================================================


% subsetLBR/2
% subsetLBR(I,L) :-
% +I : ID of legal bases
% +L : list of legal bases
% ==========
% checks that a legal basis is part of the list of legal bases
% ==========
subsetLBR(I,[L|_]) :- % good, legal basis is part of set
    legalBasis(L,(I,_,_)),!.
	
subsetLBR(I,[_|R]) :- % bad, legal basis is not first element of set
	subsetLBR(I,R),!. % recursion, check rest of set
	
subsetLBR(_,[]) :-    % bad, legal basis not part of the set
	fail.

% ================================================================


% subsetADM/2
% subsetADM(SL,L) :-
% +SL: subset of automated decision making
% +L : list of automated decision making
% ==========
% checks subset property of two sets of automated decision making
% ==========
subsetADM([A|R],L) :-
    adm(A,(N,_,_)),  % retrieve name automated decision making A
    subsetADMR(N,L), % check that name exists in L
	subsetADM(R,L).  % recursion, check rest of subset
	
subsetADM([],_).

% ================================================================


% subsetADMR/2
% subsetADMR(N,L) :-
% +N : name of automated decision making
% +L : list of automated decision making
% ==========
% checks that a automated decision making is part of the list of automated decision making
% ==========
subsetADMR(N,[L|_]) :- % good, automated decision making is part of set
    adm(L,(N,_,_)),!.
	
subsetADMR(N,[_|R]) :- % bad, automated decision making is not first element of set
	subsetADMR(N,R),!. % recursion, check rest of set
	
subsetADMR(_,[]) :-    % bad, automated decision making not part of the set
	fail.

% ================================================================


% purposeHierarchy/1
% purposeHierarchy(H) :-
% +H : the purpose hierarchy to check 
% ==========
% checks a purpose hierarchy for correct syntax
% ==========
purposeHierarchy([H|T]) :-
    purposeTuple(H),
    purposeHierarchy(T).
	
purposeHierarchy([]).

% ================================================================


% purposeTuple/1
% purposeTuple(T) :-
% +T : purpose hierarchy tuple (P,S)
%% P  : id of the parent purpose
%% S  : id of the sub-purpose
% ==========
% checks existence of purposes of a purpose hierarchy tuple
% ==========
purposeTuple((P,S)) :-
    % parent purpose
        (purpose(P,_),!; % good, a purpose with ID P is defined
        purpose(P),!;    % good, P is a given purpose
        \+ purpose(P),   % bad, neither is the case, purpose unknown
        write("unknown purpose """),
        write(P),
        writeln(""" found in purpose hierarchy")),
    % subordinate purpose
        (purpose(S,_),!; % good, a purpose with ID S is defined
        \+ purpose(S,_), % bad, purpose unknown
        write("unknown purpose """),
        write(S),
        writeln(""" found in purpose hierarchy")).

% ================================================================


% dataCheck/2
% dataCheck(D,P) :-
% +D : list of data elements
% +P : id of the corresponding purpose
% ==========
% checks for duplicate data elements in a list of data
% ==========
dataCheck(DT,P) :-
    mapDataNames(DT,DTN),         % extract names of datum elements
    getDupes(DTN,D),              % identify duplicates
    length(D,L),                  % check duplicate results
    (L > 0 ->                     % respond
	write("duplicate data elements in purpose: "),write(P),write(" | "),write(D),nl;
    L == 0).                     % all fine, nothing to do

% ================================================================


% pointOfAcceptance/1
% pointOfAcceptance(P) :-
% +P : Unix timestamp
% ==========
% checks whether P is a timestamp (integer) or an empty list (before the data subject provides consent)
% ==========
pointOfAcceptance(P) :-
	integer(P).

pointOfAcceptance([]).

% ================================================================


% dataMapping/2
% dataMapping(D,P) :-
% +D : list of data ids
% +P : id of the corresponding purpose
% ==========
% checks a list of data elements including mapping from "id" to datum element: datum(H,D)
% ==========
dataMapping([H|T],P) :-
	datum(H,D),
	datumCheck(D,P),
	dataMapping(T,P).

dataMapping([],_).

% ================================================================


% datumCheck/2
% datumCheck(D,P) :-
% +D :  data tuple (I,T,R,PA,S,DC,DG,A,H,D)
%% I  : id, no duplicates allowed in a policy
%% T  : type of data in {"Text", "Number", "Date", "Boolean", "Value Set", "Other"}
%% R  : required (bool), if true and no consent is given, the whole corresponding purpose cannot be consented
%% PA : point of acceptance, date and time when consent was provided
%% S  : sensitivity classification of the datum in {"Explicit", "QID", "Sensitive", "Non-Sensitive"} QID = (quasi-identifier)
%% DC : list of data categories (see atoms.pl)
%% DG : list of data groups, defined separately
%% A  : id of anonymization method
%% H  : headers of the datum in different languages
%% D  : descriptions of the datum in different languages
% +P : id of the corresponding purpose
% ==========
% check datum for compliance
% ==========
datumCheck((I,T,R,PA,S,DC,DG,A,H,D),P) :-
    string(I),
    dType(T),
    boolean(R),
    pointOfAcceptance(PA),
    sensitivity(S),
    dataCategories(DC,I),
    dataGroups(DG,I),
    anonymizationMethodMapping(A,I,P),
    string_concat(""" of purpose ",P,PP),
    string_concat(I,PP,NN),
    string_concat("HEAD of datum """,NN,MH),
    hdTuples(H,MH),
    string_concat("DESC of datum """,NN,MD),
    hdTuples(D,MD).

% ================================================================

% anonymizationMethodMapping/3
% anonymizationMethodMapping(A,D,P) :-
% +A : id of anonymization method
% +D : id of the corresponding data element
% +P : id of the corresponding purpose
% ==========
% checks an anonymization method including mapping from "id" to anonymization method element: datum(H,D)
% ==========
anonymizationMethodMapping([],_,_) :- !.

anonymizationMethodMapping(A,D,P) :-
	anonymizationMethod(A,AM),
	anonymizationMethodCheck(AM,D,P).

% ================================================================


% anonymizationMethodCheck/3
% anonymizationMethodCheck(AM,DT,P) :-
% +AM:  data tuple (I,A,HE,H,D)
%% I  : id, no duplicates allowed in a policy
%% A  : list of (key,value)-pairs of attributes
%% HE : ordered list of different levels of anonymization of the corresponding data (DT)
%% H  : headers of the anonymization method in different languages
%% D  : descriptions of the anonymization method in different languages
% +DT: id of the corresponding data element
% +P : id of the corresponding purpose
% ==========
% checks the anonymization method applied to data, e.g., Deletion, Suppression, or Generalization
% ==========
anonymizationMethodCheck((I,A,HE,H,D),DT,P) :-
    string(I),
    attributes(A),
    anonymizationLevels(A,DT,P), % check for minimum and maximum attributes
    values(HE),
    string_concat(""" of purpose ",P,PP),
    string_concat(""" of datum """,DT,DD),
    string_concat(DD,PP,DP),
    string_concat(I,DP,NN),
    string_concat("HEAD of anonymization method """,NN,MH),
    hdTuples(H,MH),
    string_concat("DESC of anonymization method """,NN,MD),
    hdTuples(D,MD).

% ================================================================


% privacyModelMapping/3
% privacyModelMapping(L,D,P) :-
% +L : list of privacy models
% +D : list of data ids
% +P : id of the corresponding purpose
% ==========
% checks a list of privacy models including mapping from "id" to privacy model element: privacyModel(H,P)
% ==========
privacyModelMapping(L,_,P) :- % no privacy models defined
	L \= [],
	\+ current_predicate(privacyModel/2),
	write("no privacy models defined, but the following ids are in use "),
	write(L),
	write(" in purpose: "),
	writeln(P),!.

privacyModelMapping([H|T],D,P) :-
	privacyModel(H,PM),
	privacyModelCheck(PM,D,P),
	privacyModelMapping(T,D,P).

privacyModelMapping([],_,_).

% ================================================================


% privacyModelCheck/3
% privacyModelCheck(T,DT,P) :-
% +T : privacy model tuple (I,DL,PA,H,D)
%% I  : id, no duplicates allowed in a policy
%% DL : list of ids of affected data elements
%% PA : list of (key, value)-pairs of attributes
%% H  : headers of the privacy model in different languages
%% D  : descriptions of the privacy model in different languages
% +DT: list of ids of data elements of the corresponding purpose
% +P : id of the corresponding purpose
% ==========
% checks a privacy model applied to the specified data of a purpose
% ==========
privacyModelCheck((I,DL,PA,H,D),DT,P) :-
    string(I),
	strings(DL),
    mapDataNames(DT,DTN),    % collect data tuples
    dataNamesPM(DL,DTN,I,P), % check that specified data exists
    attributes(PA),
    string_concat(""" of purpose ",P,PP),
    string_concat(I,PP,NN),
    string_concat("HEAD of privacy model """,NN,MH),
    hdTuples(H,MH),
    string_concat("DESC of privacy model """,NN,MD),
    hdTuples(D,MD).

% ================================================================


% pseudonymizationMethodMapping/3
% pseudonymizationMethodMapping(L,D,P) :-
% +L : list of pseudonymization methods
% +D : list of data ids
% +P : id of the corresponding purpose
% ==========
% checks a list of pseudonymization methods including mapping from "id" to pseudonymizationMethod element: pseudonymizationMethod(H,P)
% ==========
pseudonymizationMethodMapping(L,_,P) :- % no pseudonymization methods defined
	L \= [],
	\+ current_predicate(pseudonymizationMethod/2),
	write("no pseudonymization methods defined, but the following ids are in use "),
	write(L),
	write(" in purpose: "),
	writeln(P),!.

pseudonymizationMethodMapping([H|T],D,P) :-
	pseudonymizationMethod(H,PM),
	pseudonymizationMethodCheck(PM,D,P),
	pseudonymizationMethodMapping(T,D,P),!.

pseudonymizationMethodMapping([],_,_).

% ================================================================


% pseudonymizationMethodCheck/3
% pseudonymizationMethodCheck(T,DT,P) :-
% +T : pseudonymization method tuple (I,A,DL,H,D,PA)
%% I  : id, no duplicates allowed in a policy
%% A  : id of the attribute, resulting from the combination of the specified data
%% DL : list of ids of affected data elements
%% H  : headers of the pseudonymization method in different languages
%% D  : descriptions of the pseudonymization method in different languages
%% PA : list of (key, value)-pairs of attributes
% +DT: list of ids of data elements of the corresponding purpose
% +P : id of the corresponding purpose
% ==========
% checks a pseudonymization method applied to specified data of a purpose
% ==========
pseudonymizationMethodCheck((I,A,DL,H,D,PA),DT,P) :-
    string(I),
    string(A),
    strings(DL),
    mapDataNames(DT,DTN),          % collect data tuples
    dataNamesPSM(DL,DTN,I,P), % check that specified data exists
    string_concat(""" of purpose ",P,PP),
    string_concat(I,PP,NN),
    string_concat("HEAD of pseudonymization method """,NN,MH),
    hdTuples(H,MH),
    string_concat("DESC of pseudonymization method """,NN,MD),
    hdTuples(D,MD),
    attributes(PA).

% ================================================================


% retentionMapping/2
% retentionMapping(R,P) :-
% +D : retention id
% +P : id of the corresponding purpose
% ==========
% checks a retention element including mapping from "id" to retention element: retention(R,RT)
% ==========
retentionMapping(R,P) :-
	retention(R,RT),
	retentionCheck(RT,P).

% ================================================================


% retentionCheck/2
% retentionCheck(R,P) :-
% +R : retention tuple (T,PT,H,D)
%% T  : type in {indefinite, afterPurpose, fixedDate}
%% PT : textual representation of the retention, i.e., for afterPurpose = timeframe for deletion after completion of purpose, for fixedDate = date of deletion
%% H  : headers of the retention element in different languages
%% D  : descriptions of the retention element in different languages
% +P: id of the corresponding purpose
% ==========
% check the retention time of a purpose
% ==========
retentionCheck((T,PT,H,D),P) :-
    retentionType(T),
    string(PT),
    string_concat("HEAD of retention of purpose ",P,MH),
    hdTuples(H,MH),
    string_concat("DESC of retention of purpose ",P,MD),
    hdTuples(D,MD).

% ================================================================


% dataCategories/2
% dataCategories(L,D) :-
% +L : list of data categories
% +D : id of the corresponding datum element
% ==========
% checks whether an empty data category list is provided
% ==========
dataCategories([],D) :-
	write("data elements must have at least one data category assigned: "),
	writeln(D),!.

dataCategories(L,D) :- dataCategoriesNE(L,D).

% ================================================================


% dataCategoriesNE/2
% dataCategoriesNE(L,D) :-
% +L : list of data categories (non-empty)
% +D : id of the corresponding datum element
% ==========
% checks the list of data categories, including mapping from "id" to data category element: dataCategory(H,DC)
% a data category is a named triple, containing headers and descriptions (see atoms.pl)
% ==========
dataCategoriesNE([H|T],D) :-
	dataCategory(H,DC),
	nTriple(DC,"Data Category: "),
	dataCategoriesNE(T,D),!.

dataCategoriesNE([H|T],D) :-
	\+ dataCategory(H,_),
	write("unknown data category: "),
	write(H),
	write("("),
	write(D),
	writeln(")"),
	dataCategoriesNE(T),!.

dataCategoriesNE([],_).

% ================================================================


% dataGroups/2
% dataGroups(L,D) :-
% +L : list of data groups
% +D : id of the corresponding datum element
% ==========
% checks a list of data groups, including mapping from "id" to dataGroup element: dataGroup(H,DG)
% a data group is a named triple, containing headers and descriptions
% data groups are defined separately by policy authors
% ==========
dataGroups([H|T],D) :-
	dataGroup(H,DG),
	nTriple(DG,"Data Group: "),
	dataGroups(T,D),!.

dataGroups([H|T],D) :-
	\+ dataGroup(H,_),
	write("unknown data group: "),
	write(H),
	write("("),
	write(D),
	writeln(")"),
	dataGroups(T),!.

dataGroups([],_).

% ================================================================


% dataRecipientMapping/2
% dataRecipientMapping(L,P) :-
% +L : list of data recipients
% +P : id of the corresponding purpose
% ==========
% checks a list of data recipients, including mapping from "id" to dataRecipient element: dataRecipient(H,DR)
% ==========
dataRecipientMapping([H|T],P) :-
    dataRecipient(H,DR),
    dataRecipientCheck(DR,P),
    dataRecipientMapping(T,P).

dataRecipientMapping([],_).

% ================================================================


% dataRecipientCheck/2
% dataRecipientCheck(DR,P) :-
% +DR: data recipient tuple (I,C,A,T,R,PA,TCT,CO,AD,H,D,S)
%% I  : id, unique
%% C  : classification in {"Person", "Legal Entity", "Public Authority"}
%% A  : (unused in PriPoCoG) authInfo
%% T  : type = "Data Recipient"
%% R  : required (bool), if true and no consent is given, the whole corresponding purpose cannot be consented
%% PA : point of acceptance, date and time when consent was provided
%% TCT: third country transfer (bool), should be true for data recipients outside the European Union
%% CO : country code
%% AD : adequacy decision (bool), should be true, when an official adequacy decision for the destination country exists (see atoms.pl)
%% H  : headers of the data recipient element in different languages
%% D  : descriptions of the data recipient element in different languages
%% S  : safeguards, named triples, containing headers and descriptions
% +P : id of the corresponding purpose
% ==========
% checks a data recipient for compliance
% ==========
dataRecipientCheck((I,C,A,T,R,PA,TCT,CO,AD,H,D,S),P) :-
    entity((I,C,A,T,H,D)),
    boolean(R),
    pointOfAcceptance(PA),
    boolean(TCT),
    boolean(AD),
    aggregate_all(count,thirdCountryDR(I,TCT,CO,AD,S,P),Count), % see thirdCountryChecks.pl
    Count>0,
    nTriples(S,"Safeguard: "),
    T="Data Recipient".

% ================================================================


% legalBasisMapping/2
% legalBasisMapping(L,P) :-
% +L : list of data legal bases (ids)
% +P : id of the corresponding purpose
% ==========
% checks a list of legal bases, including mapping from "id" to legal basis element: legalBasis(H,L)
% ==========
legalBasisMapping([H|T],P) :-
	legalBasis(H,L),
    legalBasisCheck(L,P),
	legalBasisMapping(T,P).

legalBasisMapping([],_).

% ================================================================


% legalBasisCheck(L,P) :-
% +L : legal basis tuple (I,H,D)
%% I  : id in {consent, contract, legalObligation, vitalInterest, publicTask, legitimateInterest}
%% H  : headers of the legal basis element in different languages
%% D  : descriptions of the legal basis element in different languages
% +P : id of the corresponding purpose
% ==========
% check legal basis for completeness
% ==========
legalBasisCheck((I,H,D),P) :-
    legalBasis(I),
    string_concat(""" of purpose ",P,PP),
    string_concat(I,PP,LP),
    string_concat("HEAD of legal basis """,LP,MH),
    hdTuples(H,MH),
    string_concat("DESC of legal basis",LP,MD),
    hdTuples(D,MD).

% ================================================================


% automatedDecisionMakingMapping/2
% automatedDecisionMakingMapping(L,P) :-
% +L : list of automated decision making (ids)
% +P : id of the corresponding purpose
% ==========
% checks a list of automated decision making, including mapping from "id" to automated decision making element: adm(H,A)
% ==========
automatedDecisionMakingMapping([H|T],P) :-
	adm(H,A),
    automatedDecisionMakingCheck(A,P),
	automatedDecisionMakingMapping(T,P).

automatedDecisionMakingMapping([],_).

% ================================================================


% automatedDecisionMakingCheck/2
% automatedDecisionMakingCheck(A,P) :-
% +A : automated decision making tuple
% +P : id of the corresponding purpose
% ==========
% checks an automated decision making tuple for completeness
% ==========
automatedDecisionMakingCheck(A,P) :-
	string_concat("purpose """,P,PP),
    string_concat(PP,""" - Automated Decision Making: ",LP),
    nTriple(A,LP).

% ================================================================

% controllerMapping/1
% controllerMapping(L) :-
% +L : list of data controllers
% ==========
% checks a list of data controllers, including mapping from "id" to controller element: controller(H,C)
% ==========
controllerMapping([H|T],X) :-
	controller(H,C),
	controller(C),
	controllerMapping(T,X+1).

controllerMapping([],0) :-
    writeln("Information regarding the data controller must be provided!"),!.

controllerMapping([],_).

% ================================================================


% controller/1
% controller(C) :-
% +C: data controller tuple (I,C,A,T,F,L,AD,P,E,H,D)
%% I  : id, unique
%% C  : classification in {"Person", "Legal Entity", "Public Authority"}
%% A  : (unused in PriPoCoG) authInfo
%% T  : type = "Data Controller"
%% F  : first name
%% L  : last name
%% AD : address
%% P  : phone number
%% E  : email
%% H  : headers of the data controller element in different languages
%% D  : descriptions of the data controller element in different languages
% ==========
% checks a data controller for compliance
% ==========
controller((I,C,A,T,F,L,AD,P,E,H,D)) :-
    responsiblePerson((I,C,A,T,F,L,AD,P,E,H,D)),
    T="Data Controller".

% ================================================================


% dsrMapping/1
% dsrMapping(DSR,L) :-
% +DSR: list of data subject rights (ids)
% -L : list of data subject rights (tuples)
% ==========
% maps a list of ids to a list of data subject rights
% ==========
dsrMapping([H|T],[HD|TD]) :-
	dsr(H,HD),
    dsrCheck(HD),
	dsrMapping(T,TD).

dsrMapping([],[]).

% ================================================================


% dsrCheck(D) :-
% +D : DSR tuple
% ==========
% check whether the DSR is provided completely
% ==========
dsrCheck((N,H,D)) :-
    dsr(N),
    string_concat("HEAD of data subject right ",N,MH),
    hdTuples(H,MH),
    string_concat("DESC of data subject right ",N,MD),
    hdTuples(D,MD).

% ================================================================


% responsiblePerson/1
% responsiblePerson(R) :-
% +R: responsible person tuple (I,C,A,T,F,L,AD,P,E,H,D)
%% I  : id, unique
%% C  : classification in {"Person", "Legal Entity", "Public Authority"}
%% A  : (unused in PriPoCoG) authInfo
%% T  : type in {"Data Source", "Data Recipient", "Data Controller", "Data Protection Officer", "Supervisory Authority"}
%% F  : first name
%% L  : last name
%% AD : address
%% P  : phone number
%% E  : email
%% H  : headers of the responsible person element in different languages
%% D  : descriptions of the responsible person element in different languages
% ==========
% checks a responsible person for compliance
% a special type of entity used for data controllers and data protection officers
% ==========
responsiblePerson((I,C,A,T,F,L,AD,P,E,H,D)) :-
    entity((I,C,A,T,H,D)),
    string(F),
    string(L),
    string(AD),
    string(P),
    string(E).

% ================================================================


% dpoMapping/1
% dpoMapping(L) :-
% +L : list of data protection officers
% ==========
% checks a list of data protection officers, including mapping from "id" to actual dpo element: dpo(H,D)
% ==========
dpoMapping([H|T]) :-
	dpo(H,D),
	dpoCheck(D),
	dpoMapping(T).

dpoMapping([]).

% ================================================================


% dpoCheck/1
% dpoCheck(C) :-
% +C: data protection officer tuple (I,C,A,T,F,L,AD,P,E,H,D)
%% I  : id, unique
%% C  : classification in {"Person", "Legal Entity", "Public Authority"}
%% A  : (unused in PriPoCoG) authInfo
%% T  : type = "DataProtectionOfficer"
%% F  : first name
%% L  : last name
%% AD : address
%% P  : phone number
%% E  : email
%% H  : headers of the data protection officer element in different languages
%% D  : descriptions of the data protection officer element in different languages
% ==========
% checks a data protection officer for compliance
% ==========
dpoCheck((I,C,A,T,F,L,AD,P,E,H,D)) :-
    responsiblePerson((I,C,A,T,F,L,AD,P,E,H,D)),
    T="Data Protection Officer".

% ================================================================


% supervisoryAuthority/1
% supervisoryAuthority(S) :-
% +S : supervisory authority id
% ==========
% checks the supervisory authority for completeness
% ==========
supervisoryAuthority([]) :- !. % no supervisory authority defined

supervisoryAuthority(S) :-
    supervisoryAuthority(S,(I,C,A,T,F,L,AD,P,E,H,D)),
    responsiblePerson((I,C,A,T,F,L,AD,P,E,H,D)),
    C="Public Authority",
    T="Supervisory Authority".

% ================================================================


% nTriple(T,TY) :-
% +T : named triple (I,H,D)
% +TX: text for corresponding element
% ==========
% a named triple, containing the name, headers, and descriptions
% used by icons, dsrs, lc, lb, adm, datagroups
% ==========
nTriple((I,H,D),TX) :-
    string(I),
	string_concat("HEAD of ",TX,HS),
    string_concat(HS,I,MH),
    hdTuples(H,MH),
	string_concat("DESC of ",TX,DS),
    string_concat(DS,I,MD),
    hdTuples(D,MD).

% ================================================================


% hdTuples(L,N) :-
% +L : list of tuples
% +TX : text for corresponding element
% ==========
% check that HEAD and DESC tuples do not contain multiple entries for the same language
% ==========
hdTuples(HD,TX) :-
    tuples(HD,L),
    getDupes(L,D),
    (length(D,0),!;
    write("found duplicate elements for the following languages "),
    write(D),
    write(" in "),
    writeln(TX)).

% ================================================================


% nTriples(L,TY) :-
% +L : list of named triples
% +TY: type of corresponding element
% ==========
% checks a list of named triples
% ==========
nTriples([H|T],TY) :- nTriple(H,TY), nTriples(T,TY).
nTriples([],_).