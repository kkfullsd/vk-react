export const dropdownStyle = {
    container: (provided, state) => ({
        ...provided,
        width: '285px',
        borderColor: state.isFocused ? '#008000' : '#008000'
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
        borderWidth: '0',
        borderRadius: '0',
        borderBottom: '1px solid #008000',
    
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        paddingLeft: '0px',
        
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: '#121212cc',
        
    }),
  }