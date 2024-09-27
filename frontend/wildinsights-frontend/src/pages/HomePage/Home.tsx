import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axios from "../../components/Apiclient/axiosclient";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/footer";

// Importing images for the How It Works section
import recordObservationImage from '../../assets/images/record_observation.png';
import shareWithNaturalistsImage from '../../assets/images/share_with_naturalists.png';
import discussFindingsImage from '../../assets/images/discuss_findings.png';
import natureFeature1 from "../../assets/images/nature_feature1.png"; // Image 1
import natureFeature2 from "../../assets/images/nature_feature2.png"; // Image 2
import natureFeature3 from "../../assets/images/nature_feature3.png"; // Image 3
import natureFeature4 from "../../assets/images/nature_feature4.png"; // Image 4
import natureFeature5 from "../../assets/images/nature_feature5.png"; // Image 5
import natureFeature6 from "../../assets/images/nature_feature6.png"; // Image 6

// Define the type for the image gallery items
interface ImageGalleryItem {
  image: string;
  common_name: string;
}

// Define the howItWorksItems array
const howItWorksItems = [
  { id: 1, image: recordObservationImage, text: 'Record your observations' },
  { id: 2, image: shareWithNaturalistsImage, text: 'Share with fellow naturalists' },
  { id: 3, image: discussFindingsImage, text: 'Discuss your findings' }
];

// Nature features array (with 6 different images)
const natureFeatures = [
  { id: 1, image: natureFeature1, text: "Keep Track", description: "Record your encounters with other organisms and maintain life lists, all in the cloud." },
  { id: 2, image: natureFeature2, text: "Create Useful Data", description: "Help scientists and resource managers understand when and where organisms occur." },
  { id: 3, image: natureFeature3, text: "Crowdsource Identifications", description: "Connect with experts who can identify the organisms you observe." },
  { id: 4, image: natureFeature4, text: " Become a Citizen Scientist", description: "Find a project with a mission that interests you, or start your own." },
  { id: 5, image: natureFeature5, text: "Learn About Nature", description: "Build your knowledge by talking with other naturalists and helping others." },
  { id: 6, image: natureFeature6, text: "Run a Bioblitz", description: "Hold an event where people try to find as many species as possible." },
];

function HomePage() {
  const [imageGallery, setImageGallery] = useState<ImageGalleryItem[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageGalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch images from the API
  useEffect(() => {
    axios
      .get("/home_page")
      .then((response) => {
        const images = response.data.data;
        setImageGallery(images);
        setCurrentImage(images[0]); // Set the first image immediately
        setLoading(false); // Set loading to false once the first image is loaded
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, []);

  // Automatically change images every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = imageGallery.indexOf(prevImage as ImageGalleryItem);
        const nextIndex = (currentIndex + 1) % imageGallery.length;
        return imageGallery[nextIndex];
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [imageGallery]);

  const handleNextImage = () => {
    if (imageGallery.length > 0) {
      setCurrentImage((prevImage) => {
        const currentIndex = imageGallery.indexOf(prevImage as ImageGalleryItem);
        const nextIndex = (currentIndex + 1) % imageGallery.length;
        return imageGallery[nextIndex];
      });
    }
  };

  const handlePrevImage = () => {
    if (imageGallery.length > 0) {
      setCurrentImage((prevImage) => {
        const currentIndex = imageGallery.indexOf(prevImage as ImageGalleryItem);
        const prevIndex = currentIndex === 0 ? imageGallery.length - 1 : currentIndex - 1;
        return imageGallery[prevIndex];
      });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: "auto", height: "calc(100vh - 200px)" }}>
      <Navbar />

      {/* Dynamic Image Section */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          width: '620px',
          backgroundColor: '#b2e0a1',
        }}
      >
        {/* Previous Image Button */}
        <IconButton
          onClick={handlePrevImage}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-30px)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
            zIndex: 1,
            transition: 'opacity 0.3s ease-in-out',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <ArrowBack sx={{ fontSize: '1rem', color: '#1976d2' }} />
        </IconButton>

        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
          {currentImage ? (
            <>
              <img
                src={currentImage.image}
                alt={currentImage.common_name || "Species Image"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '1px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  padding: '8px',
                  textAlign: 'center',
                  borderRadius: '0 0 12px 12px',
                }}
              >
                <Typography variant="h6">
                  {currentImage.common_name || "No common name available"}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography>No images available</Typography>
          )}
        </Box>

        {/* Next Image Button */}
        <IconButton
          onClick={handleNextImage}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-30px)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
            zIndex: 1,
            transition: 'opacity 0.3s ease-in-out',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <ArrowForward sx={{ fontSize: '1rem', color: '#1976d2' }} />
        </IconButton>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Nature At Your Fingerprints
        </Typography>
        <Grid container justifyContent="center" spacing={2} sx={{ position: 'relative' }}>
          {howItWorksItems.map((item, index) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} textAlign="center" sx={{ position: 'relative' }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={item.image}
                  alt={item.text}
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mt: 2 }}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Nature Features Section */}
      <Box sx={{ py: 4, backgroundColor: '#74ac0020' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Explore Nature Features
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          {natureFeatures.map((feature) => (
            <Grid item key={feature.id} xs={12} sm={6} md={4} display="flex" alignItems="flex-start" textAlign="left">
              <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                <img
                  src={feature.image}
                  alt={feature.text}
                  style={{
                    width: '80px', // Smaller image size
                    height: 'auto',
                    objectFit: 'contain',
                    marginRight: '16px',
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {feature.text}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}

export default HomePage;
