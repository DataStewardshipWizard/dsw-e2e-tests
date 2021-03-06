export const VisibleEdit = 'VisibleEditQuestionnaire'
export const VisibleView = 'VisibleViewQuestionnaire'
export const Private = 'PrivateQuestionnaire'

export const Restricted = 'RestrictedQuestionnaire'
export const AnyoneWithLinkView = 'AnyoneWithLinkViewQuestionnaire'
export const AnyoneWithLinkEdit = 'AnyoneWithLinkEditQuestionnaire'

export const TodoUUID = '615b9028-5e3f-414f-b245-12d2ae2eeb20'

export function open(questionnaireName) {
    cy.visitApp('/projects')
    cy.clickListingItemAction(questionnaireName, 'Open Project')
    expectTitle(questionnaireName)
}


export function create(projectName, packageName) {
    cy.visitApp('/projects/create')
    cy.fillFields({
        name: projectName,
        th_packageId: packageName
    })
    cy.clickBtn('Save')
    cy.url().should('match', /\/projects\/.+/)
    expectTitle(projectName)
}


export function expectTitle(questionnaireName) {
    cy.get('.Plans__Detail__Navigation__Row__Section .title').contains(questionnaireName)
}


export function expectViewer() {
    cy.url().should('match', /\/projects\/.+/)
    cy.get('.questionnaire__form .form-group input[type=text]').should('be.disabled')
    cy.get('.questionnaire__left-panel__phase select').should('be.disabled')
    checkDisabledShareAndSettings()
}


export function expectEditor() {
    cy.url().should('match', /\/projects\/.+/)
    cy.get('.questionnaire__form .form-group input[type=text]').should('not.be.disabled')
    cy.get('.questionnaire__left-panel__phase select').should('not.be.disabled')
    checkDisabledShareAndSettings()
}


export function expectOwner() {
    cy.url().should('match', /\/projects\/.+/)
    cy.get('.questionnaire__form .form-group input[type=text]').should('not.be.disabled')
    cy.get('.questionnaire__left-panel__phase select').should('not.be.disabled')
    cy.getCy('share').should('exist')
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Settings').should('exist')
}


function checkDisabledShareAndSettings() {
    cy.getCy('share').should('not.exist')
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Settings').should('not.exist')
}

export function expectQuestion(question, visible) {
    const predicate = visible ? 'exist' : 'not.exist'
    cy.get('.form-group label').contains(question).should(predicate)
}


export function expectQuestions(questions, visible) {
    questions.forEach(q => expectQuestion(q, visible))
}


export function expectTypehints(label, typehints, query = '') {
    if (query === "") {
        cy.get('label').contains(label).closest('.form-group').find('input').focus()
    } else {
        typeAnswer(label, query)
    }
    if (typehints.length === 0) {
        cy.get('label').contains(label).closest('.form-group').find('.typehints > ul > li').should('not.exist')
    } else {
        cy.get('label').contains(label).closest('.form-group').find('.typehints > ul > li').should('have.length', typehints.length)
        cy.get('label').contains(label).closest('.form-group').find('.typehints > ul > li').each(($item, index) => {
            expect($item).to.have.text(typehints[index].name)
        })
    }
}


export function expectTypehintsError(label, message) {
    cy.get('label').contains(label).closest('.form-group').find('input').focus()
    cy.get('label').contains(label).closest('.form-group').find('.typehints > .error').contains(message)
}


export function useNthTypehint(label, n, typehint) {
    cy.get('label').contains(label).closest('.form-group').find('input').focus()
    cy.get('label').contains(label).closest('.form-group').find('.typehints > ul > li').eq(n).should('have.text', typehint.name).click()
}


export function checkTypehintExtra(label, link, logo = false) {
    cy.get('label').contains(label).closest('.form-group').find('.integration-extra > img').should(logo ? 'exist' : 'not.exist')
    cy.get('label').contains(label).closest('.form-group').find('.integration-extra > a').should('have.text', link)
}


export function selectAnswer(answer) {
    cy.get('label').contains(answer).click()
}


export function openChapter(chapter) {
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Questionnaire').click()
    cy.get('.questionnaire__left-panel__chapters .nav-link').contains(chapter).click()
}


export function openSummaryReport() {
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Metrics').click()
}


export function openPreview() {
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Preview').click()
}


export function openDocuments() {
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Documents').click()
}


export function openSettings() {
    cy.get('.Plans__Detail__Navigation__Row .nav-link').contains('Settings').click()
}

export function checkAnswerChecked(answer) {
    cy.get('label').contains(answer).find('input').should('be.checked')
}


export function checkAnswerNotChecked(answer) {
    cy.get('label').contains(answer).find('input').should('not.be.checked')
}


export function typeAnswer(label, answer) {
    cy.get('label').contains(label).closest('.form-group').find('input').clear().type(answer)
}


export function checkAnswer(label, answer) {
    cy.get('label').contains(label).closest('.form-group').find('input').should('have.value', answer)
}


export function typeAnswerText(label, answer) {
    cy.get('label').contains(label).closest('.form-group').find('textarea').clear().type(answer)
}


export function checkAnswerText(label, answer) {
    cy.get('label').contains(label).closest('.form-group').find('textarea').should('have.value', answer)
}


export function addTodoFor(question) {
    cy.get('.form-group').contains(question).find('.action-add-todo').click()
}


export function removeTodoFor(question) {
    cy.get('.form-group').contains(question).find('.action-todo a').click()
}


export function expectTodoFor(question) {
    cy.get('.form-group').contains(question).find('.action-todo a').should('exist')
}


export function expectTodo(question) {
    cy.get('.questionnaire__toolbar .item').contains('TODOs').click()
    cy.get('.todos a').contains(question).click()
    cy.get('.form-group').contains(question).should('be.visible')
        .find('.action-todo').contains('TODO')

}


export function expectTodoCount(count) {
    cy.get('.questionnaire__toolbar .item').contains('TODOs').parent().find('.badge').contains(count)
}


export function expectNoTodo() {
    cy.get('.questionnaire__toolbar .item').contains('TODOs').parent().find('.badge').should('not.exist')
    cy.get('.action-todo').should('not.exist')
}


export function expectSummaryReportAnswered(indication, chapter) {
    openSummaryReport()

    const checkCells = ($cells, text) => {
        cy.wrap($cells).should('have.length', 2)
        cy.wrap($cells[0]).should('contain.text', text)
    }

    const checkRows = ($rows) => {
        cy.wrap($rows).should('have.length', 2)
        cy.wrap($rows[0]).find('td').then(($cells) => { 
            checkCells($cells, `Answered (current phase): ${indication.current.answered}/${indication.current.all}`)
        })
        cy.wrap($rows[1]).find('td').then(($cells) => {
            checkCells($cells, `Answered: ${indication.all.answered}/${indication.all.all}`)
        })
    }

    if (chapter === undefined) {
        cy.get('.questionnaire__summary-report > table.indication-table').find('tr.indication').then(($rows) => {
            checkRows($rows)
        })
    } else {
        cy.get('.questionnaire__summary-report').contains('h3', chapter).parent().find('table.indication-table tr.indication').then(($rows) => {
            checkRows($rows)
        })
    }
}


export function expectSummaryReportMetrics(metrics, chapter) {
    openSummaryReport()

    const checkCells = ($cells, metric) => {
        cy.wrap($cells).should('have.length', 3)
        cy.wrap($cells[0]).should('contain.text', metric.name)
        cy.wrap($cells[1]).should('contain.text', metric.value)
    }

    if (chapter === undefined) {
        if (metrics.length === 0) {
            cy.get('.questionnaire__summary-report > div.row').find('.table-metrics-report').should('not.exist')
        } else {
            cy.get('.questionnaire__summary-report > div.row').find('.table-metrics-report').should('exist')
            cy.get('.questionnaire__summary-report > div.row').find('.table-metrics-report tbody tr').should('have.length', metrics.length)
            metrics.forEach((metric, index) => {
                cy.get('.questionnaire__summary-report > div.row').find('.table-metrics-report tbody tr').eq(index).find('td').then(($cells) => {
                    checkCells($cells, metric)
                })
            })
        }
    } else {
        if (metrics.length === 0) {
            cy.get('.questionnaire__summary-report').contains('h3', chapter).parent().find('.table-metrics-report').should('not.exist')
        } else {
            cy.get('.questionnaire__summary-report').contains('h3', chapter).parent().find('.table-metrics-report').should('exist')
            cy.get('.questionnaire__summary-report').contains('h3', chapter).parent().find('.table-metrics-report tbody tr').should('have.length', metrics.length)
            metrics.forEach((metric, index) => {
                cy.get('.questionnaire__summary-report').contains('h3', chapter).parent().find('.table-metrics-report tbody tr').eq(index).find('td').then(($cells) => {
                    checkCells($cells, metric)
                })
            })
        }
    }
}


export function awaitSave() {
    cy.get('.questionnaire-header__saving').contains('Saved')
}


export function resolveAndFinalizeMigration() {
    cy.clickBtn('Resolve')
    cy.clickBtn('Finalize migration')
    cy.url().should('match', /\/projects\/.+/)
}


export function finalizeMigration() {
    cy.clickBtn('Finalize migration')
    cy.url().should('match', /\/projects\/.+/)
}
