public with sharing class AccountCasesController {

    @AuraEnabled
    public static List<Case> findCasesBySubject(Id accountId, String subjectSearchTerm) {
        List<Case> cases = [SELECT Id, Subject, Status, Priority FROM Case WHERE AccountId = :accountId AND Subject LIKE :('%' + subjectSearchTerm + '%')];
        System.debug('Cases found: ' + cases.size());
        return cases;
    }


}
