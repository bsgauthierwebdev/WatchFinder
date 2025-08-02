import { useEffect, useState } from 'react';
import { useAuth } from './../../context/AuthContext';
import PreferenceSelector from '../../components/PreferenceSelector/PreferenceSelector';
import axios from 'axios';
import { allBrands, commonBrands, conditions, dialColors, frequencyOptions, movements, platforms, strapStyles, watchStyles } from '../../utils/preferenceOptions';
import RangeInput from '../../components/RangeInput/RangeInput';
import "./preferences.css"

const Preferences = () => {
  const {userData, refreshUserData} = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [form, setForm] = useState({
    platforms: [],
    brands: [],
    case_size_min: 36,
    case_size_max: 44,
    strap_styles: [],
    movements: [],
    watch_styles: [],
    price_min: 0,
    price_max: 100000,
    seller_location: "",
    condition: [],
    dial_colors: [],
    frequency: ""
  })

  const token = localStorage.getItem("token")

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.get("/api/preferences", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = res.data
        setPreferences(data)
        setForm({
          platforms: data.platforms || [],
          brands: data.brands || [],
          case_size_min: data.case_size_min || 36,
          case_size_max: data.case_size_max || 44,
          strap_styles: data.strap_styles || [],
          movements: data.movements || [],
          watch_styles: data.watch_styles || [],
          price_min: data.price_min || 0,
          price_max: data.price_max || 100000,
          seller_location: data.seller_location || "",
          condition: data.condition || [],
          dial_colors: data.dial_colors || [],
          frequency: data.frequency || "",
        })

      } catch (err) {
        console.error("Failed to load preferences: ", err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userData) fetchPreferences()
  }, [userData])

  const handleChange = (key, value) => {
    setForm((prev) => ({...prev, [key]: value}))
  }

  const handleMultiChange = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value)
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")
    setSaving(true)

    try {
      const res = await axios.post("/api/preferences", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.status === 200) {
        setSuccessMessage("Preferences saved successfully")
        await refreshUserData()
      } else {
        setErrorMessage("Something went wrong, please try again")
      }

    } catch (err) {
      console.error("Failed to save preferences: ", err.response?.data?.message || err.message)
      setErrorMessage(err.response?.data?.message || "Server error, please try again")
    }
    finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
        setErrorMessage("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  if (loading) return <p>Loading preferences...</p>

  return (
    <div className="preferences-container">
      <form onSubmit = {handleSubmit} className="preferences-form">
        <div className="preferences-header">
          <h2 className="preferences-title">Your Preferences</h2>
        </div>





        <div className="preferences-options">
          <PreferenceSelector 
            label = "Platforms"
            options = {platforms}
            selectedOptions = {form.platforms}
            onChange = {(updated) => 
              handleChange("platforms", updated)
            }
          />

          {/* Brands */}
          <PreferenceSelector
            label = "Brands"
            options = {commonBrands}
            selectedOptions = {form.brands}
            onChange = {(updated) => 
              handleChange("brands", updated)
            }
          />

          {/* Case Size */}
          <RangeInput 
            label = "Case Size (mm)"
            min = {28}
            max = {60}
            valueMin={form.case_size_min}
            valueMax={form.case_size_max}
            onMinChange={(val) => handleChange("case_size_min", parseInt(val))}
            onMaxChange={(val) => handleChange("case_size_max", parseInt(val))}
          />

          {/* Strap Styles */}
          <PreferenceSelector
            label = "Strap Styles"
            options = {strapStyles}
            selectedOptions = {form.strap_styles}
            onChange = {(updated) => 
              handleChange("strap_styles", updated)
            }
          />

          {/* Movements */}
          <PreferenceSelector
            label = "Movements"
            options = {movements}
            selectedOptions = {form.movements}
            onChange = {(updated) => 
              handleChange("movements", updated)
            }
          />

          {/* Watch Styles */}
          <PreferenceSelector
            label = "Watch Styles"
            options = {watchStyles}
            selectedOptions = {form.watch_styles}
            onChange = {(updated) => 
              handleChange("watch_styles", updated)
            }
          />

          {/* Price Range */}
          <RangeInput 
            label = "Price Range ($)"
            min = {0}
            max = {500000}
            valueMin={form.price_min}
            valueMax={form.price_max}
            onMinChange = {(val) => handleChange("price_min", parseInt(val))}
            onMaxChange = {(val) => handleChange("price_max", parseInt(val))}
          />

          {/* Seller Location */}
          <div className="location">
            <label className="location-label">Seller Location</label>
            <input 
              type="text"
              value = {form.seller_location}
              onChange = {(e) => handleChange("seller_location", e.target.value.trimStart())}
              className = "location-input" 
            />
          </div>

          {/* Condition */}
          <PreferenceSelector
            label = "Condition"
            options = {conditions}
            selectedOptions = {form.condition}
            onChange = {(updated => 
              handleChange("condition", updated)
            )}
          />

          {/* Dial Colors */}
          <PreferenceSelector
            label = "Dial Colors"
            options = {dialColors}
            selectedOptions = {form.dial_colors}
            onChange = {(updated) => 
              handleChange("dial_colors", updated)
            }
          />

          {/* Frequency */}
          <div className="frequency">
            <label className="frequency-label">Notification Frequency</label>
            <select 
              value = {form.frequency}
              onChange = {(e) => {handleChange("frequency", e.target.value)}}
              className="frequency-select"
            >
              <option value="" className="frequency-options">Select Frequency</option>
              {frequencyOptions.map((opt) => (
                <option key = {opt} value = {opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="preferences-submit">
          <button type = "submit" className="preferences-btn" disabled = {saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
        <div className="preferences-messages">
          {successMessage && (
            <p className="message-success">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="message-error">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Preferences
