describe('Menu', () => {
    [{
        role: 'admin',
        menu: {
            contains: ['Users', 'Knowledge Model Editor', 'Knowledge Models', 'Projects', 'Documents', 'Templates'],
            notContais: []
        },
        sidebarLinks: {
            contains: ['Help', 'Settings', 'Albert Einstein'],
            notContains: []
        }
    }, {
        role: 'datasteward',
        menu:{
            contains: ['Knowledge Model Editor', 'Knowledge Models', 'Projects', 'Templates'],
            notContais: ['Users', 'Documents']
        },
        sidebarLinks: {
            contains: ['Help', 'Nikola Tesla'],
            notContains: ['Settings']
        }
    }, {
        role: 'researcher',
        menu: {
            contains: ['Knowledge Models', 'Projects'],
            notContais: ['Users', 'Knowledge Model Editor', 'Documents', 'Templates']
        },
        sidebarLinks: {
            contains: ['Help', 'Nikola Tesla'],
            notContains: ['Settings']
        }
    }].forEach((roleItems) => {
        it('should contain correct items for ' + roleItems.role, () => {
            cy.loginAs(roleItems.role)
            cy.visitApp('/dashboard')

            roleItems.menu.contains.forEach((item) => {
                cy.get('.menu li').contains(item)
            })

            roleItems.menu.notContais.forEach((item) => {
                cy.get('.menu li').contains(item).should('not.exist')
            })

            roleItems.menu.contains.forEach((item) => {
                cy.get('.sidebar-link').contains(item)
            })

            roleItems.menu.notContais.forEach((item) => {
                cy.get('.sidebar-link').contains(item).should('not.exist')
            })
        })
    })
})
