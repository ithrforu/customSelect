const nativeSelects = document.querySelectorAll('select');

for (let select of nativeSelects) {
  const selectOptions = [].map.call(select.options, option => option.outerText);
  select.classList.add('select-hidden');
  select.setAttribute('role', 'listbox');
  renderCustomSelect(select, selectOptions);
}

function renderCustomSelect(select, optionsList) {
  const customSelect = document.createElement('div');
  customSelect.classList.add('select');
  customSelect.setAttribute('tabindex', '0');

  const currentValue = document.createElement('span');
  currentValue.classList.add('value');
  currentValue.textContent = optionsList[0];

  const optionListElement = document.createElement('ul');
  optionListElement.className = 'optList hidden';
  optionListElement.setAttribute('role', 'presentation');
  select.after(customSelect);
  customSelect.append(currentValue, optionListElement);

  for (let optionItem of optionsList) {
    const option = document.createElement('li');
    option.classList.add('option');
    option.setAttribute('role', 'option');
    option.textContent = optionItem;
    optionListElement.append(option);
  }

  const selectedIndex = getIndex(customSelect);
  customSelect.tabIndex = 0;
  customSelect.previousSibling.tabIndex = -1;
  updateValue(customSelect, selectedIndex);

  // Прослушиватели
  const optionElements = optionListElement.children;

  for (let i = 0; i < optionElements.length; i += 1) {
    const optionElement = optionElements[i];

    optionElement.addEventListener('mouseover', () => {
      highlightOption(optionElements, optionElement);
    });
    optionElement.addEventListener('click', () => {
      updateValue(customSelect, i);
    });
  }

  customSelect.addEventListener('click', () => toggleOptList(optionListElement));

  customSelect.addEventListener('focus', () => activeSelect(customSelect));

  customSelect.addEventListener('blur', () => deactivateSelect(customSelect));

  customSelect.addEventListener('keyup', (e) => {
    const length = optionElements.length;
    let index = getIndex(customSelect);

    if(e.key == 'ArrowDown' && index < length - 1) {
      index += 1;
    }

    if(e.key == 'ArrowUp' && index > 0) {
      index -= 1;
    }

    if(e.key == 'Escape') {
      deactivateSelect(customSelect, optionsList)
    }

    updateValue(customSelect, index);
  });

}

function deactivateSelect(select) {
  const optionListElement = select.querySelector('.optList');

  if(!select.classList.contains('active')) return;

  optionListElement.classList.add('hidden');
  select.classList.remove('active');
}

function activeSelect(select) {
  const optionListElement = select.querySelector('.optList');
  if(select.classList.contains('active')) return;

  [].forEach.call(optionListElement, deactivateSelect);
  select.classList.add('active');
}

function toggleOptList(options) {
  options.classList.toggle('hidden');
}

function highlightOption(options, optionElement) {

  for (let option of options) {
   option.classList.remove('hightlight');
  }

  optionElement.classList.add('hightlight');
}

function updateValue(select, index) {
  const nativeSelect = select.previousElementSibling;
  const value = select.querySelector('.value');
  const optionElements = select.querySelectorAll('.option');
  console.log(index)
  nativeSelect.selectedIndex = index;
  value.innerHTML = optionElements[index].innerHTML;

  for (let optionElement of optionElements) {
    optionElement.setAttribute('aria-selected', 'false');
  }

  optionElements[index].setAttribute('aria-selected', 'true');

  highlightOption(optionElements, optionElements[index]);
}

function getIndex(select) {
  const nativeSelect = select.previousElementSibling;
  return nativeSelect.selectedIndex;
}