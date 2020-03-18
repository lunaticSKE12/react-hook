import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const Ingredients = () => {
  const [useIngredients, setUserIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    console.log('REDERING INGREDIENTS', useIngredients)
  }, [useIngredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    fetch('https://react-hook-4ed05.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false)
      return response.json()
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    })
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true)
    fetch(`https://react-hook-4ed05.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false)
      setUserIngredients(prevIngredients =>
        prevIngredients.filter((ingredient) =>
          ingredient.id !== ingredientId)
      )
    }).catch(error => {
      setError('Something when wrong')
    })
  }

  const clearError = () => {
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={useIngredients}
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;