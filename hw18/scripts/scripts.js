'use strict';

!(function () {
    function createElement({
        tagName = 'div',
        classes = [],
        dataAttributes = {},
        textContent = ''
    }) {
        if (typeof tagName !== 'string') {
            console.warn(`tagName _createElement method of App must be String!`);
            let errorElement = document.createElement('div');
            errorElement.tagName = 'tagName _createElement method of App must be String!';
            return errorElement;
        }

        let element = document.createElement(tagName);

        if (Array.isArray(classes)) {
            classes.forEach(className => {
                if (typeof className === 'string') {
                    element.classList.add(className);
                } else {
                    console.warn(`classes element of App _createElement method must be String!`);
                }
            });
        }

        if (typeof dataAttributes === 'object' && dataAttributes) {
            Object.entries(dataAttributes).forEach(pair => {
                if (typeof pair[0] === 'string' && typeof pair[1] === 'string') {
                    element.setAttribute(pair[0], pair[1]);
                } else {
                    console.warn(`dataAttributes element of App _createElement must be String!`);
                }
            });
        }

        if (typeof textContent === 'string') {
            element.textContent = textContent;
        } else {
            console.warn(`textContent element of App _createElement must be String!`);
        }

        return element;
    }

    class App {
        constructor() {
            let LS = localStorage;
            let _body = document.querySelector('body');
            let _nameField, _descriptionField, _cardsBlock;

            this.cardsArr = [];
            this.init = function () {
                _init();
            };

            let _getCards = () => {
                let cardsJSON = LS.getItem('cards');
                if (cardsJSON) {
                    let cardsData = JSON.parse(cardsJSON);
                    this.cardsArr = cardsData.map(cardData => {
                        return new Card({
                            cardTitle: cardData.title,
                            cardText: cardData.text
                        });
                    });
                    this.cardsArr.forEach(card => {
                        _cardsBlock.append(card.element);
                    });
                }
            };

            let _init = () => {
                let appBlock = createElement({
                    classes: ['container']
                });
                let title = createElement({
                    tagName: 'h1',
                    textContent: 'Awesome TODO App'
                });
                let createCardButton = createElement({
                    tagName: 'button',
                    classes: ['btn', 'btn-primary'],
                    textContent: 'Create card'
                });
                _cardsBlock = createElement({
                    classes: ['container', 'card-block']
                });
                _nameField = createElement({
                    tagName: 'input',
                    classes: ['form-control'],
                    dataAttributes: {
                        placeholder: 'Name',
                        autocomplete: 'autocomplete'
                    }
                });
                _descriptionField = createElement({
                    tagName: 'textarea',
                    classes: ['form-control'],
                    dataAttributes: {
                        placeholder: 'Description',
                        autocomplete: 'autocomplete'
                    }
                });

                _body.append(appBlock);
                appBlock.append(title, _nameField, _descriptionField, createCardButton, _cardsBlock);

                createCardButton.addEventListener('click', _createCard.bind(this));

                _getCards();
            };

            let _createCard = () => {
                let cardTitle = _nameField.value;
                let cardText = _descriptionField.value;
                let textFieldStates = [];

                textFieldStates.push(_validateTextField(_nameField), _validateTextField(_descriptionField));
                if (textFieldStates.some(state => state === false))
                    return;

                let isExist = this.cardsArr.some(card => card.title === cardTitle);
                let isCreate;

                if (isExist) {
                    isCreate = confirm('You have a card with a current title. Do you want to add one more?');
                    if (!isCreate)
                        return;
                }

                let card = new Card({
                    cardTitle,
                    cardText
                });

                this.cardsArr.push(card);
                let cardsStates = this.cardsArr.map(card => {
                    return {
                        title: card.title,
                        text: card.text,
                    };
                });

                LS.setItem('cards', JSON.stringify(cardsStates));

                _cardsBlock.append(card.element);
                _nameField.value = '';
                _descriptionField.value = '';
            };

            let _validateTextField = (field) => {
                if (field.value === '') {
                    field.classList.add('is-invalid');
                    return false;
                } else {
                    field.classList.remove('is-invalid');
                    return true;
                }
            };
        }
    }

    class Card {
        constructor({
            cardTitle = '', cardText = ''
        }) {
            let _deleteButton;

            let _createElement = () => {
                let cardElement = createElement({
                    classes: ['card']
                });
                let cardTitleElement = createElement({
                    tagName: 'h4',
                    classes: ['card-title'],
                    textContent: cardTitle
                });
                let cardTextElement = createElement({
                    tagName: 'p',
                    classes: ['card-text'],
                    textContent: cardText
                });

                let controlsContainer = createElement({
                    classes: ['controls-container']
                });

                let updateButton = createElement({
                    tagName: 'button',
                    classes: ['btn', 'btn-primary'],
                    textContent: 'Update card'
                });
                _deleteButton = createElement({
                    tagName: 'button',
                    classes: ['btn', 'btn-primary'],
                    textContent: 'Delete card'
                });
                let importanceCheckbox = createElement({
                    tagName: 'input',
                    classes: ['form-check-input'],
                    dataAttributes: {
                        type: 'checkbox',
                        id: 'importanceCheckbox'
                    }
                });
                let importanceCheckboxLabel = createElement({
                    tagName: 'label',
                    classes: ['form-check-label'],
                    dataAttributes: {
                        for: 'importanceCheckbox'
                    },
                    textContent: 'Important!'
                });

                controlsContainer.append(updateButton, _deleteButton, importanceCheckbox, importanceCheckboxLabel);
                cardElement.append(cardTitleElement, cardTextElement, controlsContainer);

                return cardElement;
            };

            let _element = _createElement();

            this.title = cardTitle;
            this.text = cardText;
            this.element = _element;

            let _attachEvents = () => {
                _deleteButton.addEventListener('click', _deleteCard);
            };

            let _deleteCard = () => {
                _element.remove();
            };

            _attachEvents();
        }
    }

    let app = new App();
    app.init();
}());