@IsTest
private class AccountCasesControllerTest {
    @TestSetup
    static void setup() {
        Account testAccount = TestDataFactory.createTestAccount();

        insert new Case(
            AccountId = testAccount.Id,
            Subject = 'Problème de facturation',
            Status = 'New',
            Priority = 'High',
            Origin = 'Phone'
        );

        insert new Case(
            AccountId = testAccount.Id,
            Subject = 'Demande support technique',
            Status = 'Working',
            Priority = 'Medium',
            Origin = 'Email'
        );
    }

    @IsTest
    static void testFindCasesBySubject() {
        Account testAccount = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();
        List<Case> results = AccountCasesController.findCasesBySubject(testAccount.Id, 'facturation');
        Test.stopTest();

        Assert.areEqual(1, results.size(), 'Should return one case');
        Assert.areEqual('Problème de facturation', results[0].Subject, 'Should return the matching case');
    }

    @IsTest
    static void testFindCasesBySubjectNoResults() {
        Account testAccount = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();
        List<Case> results = AccountCasesController.findCasesBySubject(testAccount.Id, 'inexistant');
        Test.stopTest();

        Assert.areEqual(0, results.size(), 'Should return no cases');
    }
}